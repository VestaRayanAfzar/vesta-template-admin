import {IUser} from "../cmn/models/User";
import {IPermission} from "../cmn/models/Permission";
import {IRole} from "../cmn/models/Role";
import {Dispatcher} from "./Dispatcher";
import {AclAction, AclPolicy} from "../cmn/enum/Acl";

export interface IPermissionCollection {
    [resource: string]: Array<string>;
}

interface IStateResourceMap {
    [state: string]: IPermissionCollection;
}

export interface IAccess {
    [action: string]: boolean;
}

export class AuthService {
    static instance: AuthService = null;
    static Events = {Update: 'auth-update'};
    private tokenKeyName: string = 'auth-token';
    private userKeyName: string = 'userData';
    private dispatch = Dispatcher.getInstance().dispatch;
    private storage: Storage = localStorage;
    private user: IUser = null;
    private permissions: IPermissionCollection = {};
    private defaultPolicy: AclPolicy = AclPolicy.Deny;
    public stateResourceMap: IStateResourceMap = {};

    constructor() {
        try {
            this.user = JSON.parse(this.storage.getItem(this.userKeyName));
            if (!this.user) this.user = {};
            this.updatePermissions();
        } catch (e) {
            this.logout();
        }
    }

    public logout(): void {
        this.storage.removeItem(this.tokenKeyName);
        this.storage.removeItem(this.userKeyName);
    }

    public login(user: IUser) {
        this.user = user;
        this.storage.setItem(this.userKeyName, JSON.stringify(user));
        this.updatePermissions();
    }

    private updatePermissions() {
        this.permissions = {};
        let role = <IRole>this.user.role;
        if (!role) return this.dispatch(AuthService.Events.Update, this.user);
        for (let k = role.permissions.length; k--;) {
            let permission = <IPermission>role.permissions[k];
            if (!(permission.resource in this.permissions)) {
                this.permissions[permission.resource] = [];
            }
            this.permissions[permission.resource].push(permission.action);
        }
        this.dispatch(AuthService.Events.Update, this.user);
    }

    public isGuest(): boolean {
        return !(this.user && this.user.id);
    }

    public getUser(): IUser {
        return this.user;
    }

    public setToken(token: string) {
        this.storage.setItem(this.tokenKeyName, token);
    }

    public getToken(): string {
        return <string>this.storage.getItem(this.tokenKeyName);
    }

    /**
     Check if user has access to all actions of all resources
     */
    public hasAccessToState(state: number): boolean {
        if (!state) return true;
        let requiredPermissions = this.stateResourceMap[state];
        if (!requiredPermissions) return this.defaultPolicy == AclPolicy.Allow;
        for (let resources = Object.keys(requiredPermissions), i = resources.length; i--;) {
            let resource = resources[i];
            let actions = requiredPermissions[resource];
            for (let j = actions.length; j--;) {
                if (!this.isAllowed(resource, actions[j])) return false;
            }
        }
        return true;
    }

    /**
     Check if user has access to the action of resource
     */
    public isAllowed(resource: string, action: string): boolean {
        let userPermissions = this.permissions;
        let userActions = userPermissions[resource];
        if ((userActions && (userActions.indexOf('*') >= 0 || userActions.indexOf(action) >= 0)) ||
            (userPermissions['*'] && (userPermissions['*'].indexOf('*') >= 0 || userPermissions['*'].indexOf(action) >= 0))) {
            return true
        }
        return this.defaultPolicy == AclPolicy.Allow;
    }

    public getAccessList(resource: string, ...actions: Array<string>): IAccess {
        if (!actions.length) {
            actions = [AclAction.Read, AclAction.Add, AclAction.Edit, AclAction.Delete];
        }
        let access = {};
        for (let i = actions.length; i--;) {
            if (this.isAllowed(resource, actions[i])) access[actions[i]] = true;
        }
        return access;
    }

    /**
     * Same states will overwrite each others
     */
    public registerPermissions(state: number, permissions?: IPermissionCollection) {
        this.stateResourceMap[state] = permissions || {};
    }

    public setDefaultPolicy(policy: AclPolicy) {
        this.defaultPolicy = policy;
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
}

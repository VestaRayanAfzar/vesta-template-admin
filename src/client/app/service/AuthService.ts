import {IUser} from "../cmn/models/User";
import {IPermission, Permission} from "../cmn/models/Permission";
import {IRoleGroup} from "../cmn/models/RoleGroup";
import {IRole} from "../cmn/models/Role";
import {Dispatcher} from "./Dispatcher";
import {AclPolicy} from "../cmn/enum/Acl";

export interface IAclActions {
    [action: string]: boolean;
}

export interface IPermissionCollection {
    [resource: string]: Array<string>;
}

interface IStateResourceMap {
    [state: string]: IPermissionCollection;
}

export class AuthService {
    static instance: AuthService = null;
    static Events = {Update: 'auth-update'};
    private tokenKeyName: string = 'auth-token';
    private userKeyName: string = 'userData';
    private storage: Storage = localStorage;
    private user: IUser = null;
    private permissions: IPermissionCollection = {};
    private defaultPolicy: AclPolicy = AclPolicy.Deny;
    public stateResourceMap: IStateResourceMap = {};

    constructor() {
        AuthService.instance = this;
        try {
            this.user = JSON.parse(this.storage.getItem(this.userKeyName));
            this.updatePermissions();
        } catch (e) {
            this.logout();
        }
    }

    public logout(): void {
        this.login(<IUser>{});
    }

    public login(user: IUser) {
        this.user = user;
        this.storage.setItem(this.userKeyName, JSON.stringify(user));
        this.updatePermissions();
    }

    private updatePermissions() {
        this.permissions = {};
        if (this.user.roleGroups) {
            for (let i = this.user.roleGroups.length; i--;) {
                let roleGroup = <IRoleGroup>this.user.roleGroups[i];
                if (!roleGroup) continue;
                for (let j = roleGroup.roles.length; j--;) {
                    let role = <IRole>roleGroup.roles[j];
                    for (let k = role.permissions.length; k--;) {
                        let permission = <IPermission>role.permissions[k];
                        if (!(permission.resource in this.permissions)) {
                            this.permissions[permission.resource] = [];
                        }
                        this.permissions[permission.resource].push(permission.action);
                    }
                }
            }
        }
        Dispatcher.getInstance().dispatch(AuthService.Events.Update, {user: this.user});
    }

    public isGuest(): boolean {
        return !(this.user && this.user.id);
    }

    public getUser() {
        return this.user;
    }

    public setToken(token: string): void {
        this.storage.setItem(this.tokenKeyName, token);
    }

    public getToken(): string {
        return <string>this.storage.getItem(this.tokenKeyName);
    }

    /**
     Check if user has access to all actions of all resources
     */
    public hasAccessToState(state: string | number): boolean {
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
            (userPermissions['*'] && (userPermissions['*'].indexOf('*') >= 0 || userPermissions['*'].indexOf(action) >= 0 ))) {
            return true
        }
        return this.defaultPolicy == AclPolicy.Allow;
    }

    /**
     Returns an object containing the actions which user has access to execute them.
     In case of * action, the CRUD actions will be added by default.
     Developer must take care of other actions (other than CRUD), in case of *
     */
    public getActionsOn(resource: string): IAclActions {
        let userPermissions = this.permissions;
        let userActions = userPermissions[resource] || userPermissions['*'];
        if (!userActions || !userActions.length) return <IAclActions>{};
        let granted: IAclActions = {};
        if (userActions.indexOf('*') >= 0) {
            granted = {
                [Permission.Action.Read]: true,
                [Permission.Action.Add]: true,
                [Permission.Action.Edit]: true,
                [Permission.Action.Delete]: true
            };
        }
        for (let i = userActions.length; i--;) {
            granted[userActions[i]] = true;
        }
        return granted;
    }

    /**
     Same states will overwrite each others
     */
    public registerPermissions(state: string, permissions?: IPermissionCollection) {
        this.stateResourceMap[state] = permissions || {};
    }

    public setDefaultPolicy(policy: AclPolicy) {
        this.defaultPolicy = policy;
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            return new AuthService;
        }
        return AuthService.instance;
    }
}

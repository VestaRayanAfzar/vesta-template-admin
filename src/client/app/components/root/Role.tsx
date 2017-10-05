import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {Route, Switch} from "react-router";
import {DynamicRouter, IValidationError} from "../../medium";
import {PageTitle} from "../general/PageTitle";
import {Preloader} from "../general/Preloader";
import {CrudMenu} from "../general/CrudMenu";
import {IRole, Role as RoleModel} from "../../cmn/models/Role";
import {RoleAdd} from "./role/RoleAdd";
import {RoleEdit} from "./role/RoleEdit";
import {RoleDetail} from "./role/RoleDetail";
import {RoleList} from "./role/RoleList";
import {IPermission} from "../../cmn/models/Permission";

export interface IExtPermission {
    [name: string]: Array<{
        id: number;
        action: string;
    }>
}

export interface RoleParams {
}

export interface RoleProps extends PageComponentProps<RoleParams> {
}

export interface RoleState extends PageComponentState {
    showLoader: boolean;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export class Role extends PageComponent<RoleProps, RoleState> {

    constructor(props: RoleProps) {
        super(props);
        this.state = {validationErrors: null, showLoader: false, permissions: {}};
    }

    public componentDidMount() {
        this.fetchPermissions();
    }

    public fetch = (id: number) => {
        this.setState({showLoader: true});
        return this.api.get<IRole>(`acl/role/${id}`)
            .then(response => {
                this.setState({showLoader: false});
                return response.items[0];
            })
            .catch(error => {
                this.notif.error(error.message);
                this.setState({showLoader: false});
            })
    }

    public fetchAll = () => {
        this.setState({showLoader: true});
        return this.api.get<IRole>('acl/role')
            .then(response => {
                this.setState({showLoader: false});
                return response.items;
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(error.message);
            })
    }

    public save = (model: IRole) => {
        let role = new RoleModel(model);
        role.status = +role.status;
        const saveType = model.id ? 'update' : 'add';
        let validationResult = role.validate();
        if (validationResult) {
            return this.setState({validationErrors: validationResult});
        }
        this.setState({showLoader: true});
        let data = role.getValues<IRole>();
        (model.id ? this.api.put<IRole>('acl/role', data) : this.api.post<IRole>('acl/role', data))
            .then(response => {
                this.notif.success(this.tr.translate(`info_${saveType}_record`, `${response.items[0].id}`));
                this.props.history.goBack();
                this.setState({showLoader: false});
            })
            .catch(error => {
                this.notif.error(error.message);
                this.setState({validationErrors: error.validation, showLoader: false});
            });
    }

    public fetchPermissions = () => {
        this.setState({showLoader: true});
        if (this.state.permissions.length) return;
        this.api.get<IPermission>('acl/permission')
            .then(response => {
                // converting list of [{resource, action}] => {resource=> [actions]}
                let permissions: IExtPermission = {};
                for (let i = 0, il = response.items.length; i < il; ++i) {
                    const p: IPermission = response.items[i] as IPermission;
                    if (!permissions[p.resource]) {
                        permissions[p.resource] = [];
                    }
                    permissions[p.resource].push({id: p.id, action: p.action});
                }
                this.setState({showLoader: false, permissions: permissions});
            })
            .catch(error => {
                this.notif.error(error.message);
                this.setState({showLoader: false});
            })
    }

    public render() {
        const tr = this.tr.translate;
        return (
            <div className="page role-component">
                <PageTitle title={tr('mdl_role')}/>
                <h1>{tr('mdl_role')}</h1>
                <Preloader options={{show: this.state.showLoader}}/>
                <CrudMenu path="role"/>
                <DynamicRouter>
                    <Switch>
                        <Route path="/role/add" render={this.tz.willTransitionTo(RoleAdd, {role: ['add']}, {
                            save: this.save,
                            validationErrors: this.state.validationErrors,
                            permissions: this.state.permissions
                        })}/>
                        <Route path="/role/edit/:id" render={this.tz.willTransitionTo(RoleEdit, {role: ['edit']}, {
                            save: this.save,
                            fetch: this.fetch,
                            validationErrors: this.state.validationErrors,
                            permissions: this.state.permissions
                        })}/>
                        <Route path="/role/detail/:id" render={this.tz.willTransitionTo(RoleDetail, {role: ['read']}, {
                            fetch: this.fetch
                        })}/>
                        <Route render={this.tz.willTransitionTo(RoleList, {role: ['read']}, {
                            fetch: this.fetchAll
                        })}/>
                    </Switch>
                </DynamicRouter>
            </div>);
    }
}

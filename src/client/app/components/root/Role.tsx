import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {Route, Switch} from "react-router";
import {PageTitle} from "../general/PageTitle";
import {Preloader} from "../general/Preloader";
import {CrudMenu} from "../general/CrudMenu";
import {IRole, Role as RoleModel} from "../../cmn/models/Role";
import {RoleAdd} from "./role/RoleAdd";
import {RoleEdit} from "./role/RoleEdit";
import {RoleDetail} from "./role/RoleDetail";
import {IPermission} from "../../cmn/models/Permission";
import {IAccess} from "../../service/AuthService";
import Navbar from "../general/Navbar";
import {RoleList} from "./role/RoleList";
import {IDataTableQueryOption} from "../general/DataTable";
import {DynamicRouter} from "../general/DynamicRouter"
import {IValidationError} from "../../cmn/core/Validator";

export interface IAction {
    id: number;
    action?: string;
}

export interface IExtPermission {
    [name: string]: Array<IAction>;
}

export interface RoleParams {
}

export interface RoleProps extends PageComponentProps<RoleParams> {
}

export interface RoleState extends PageComponentState {
    showLoader: boolean;
    validationErrors: IValidationError;
    roles: Array<IRole>;
    queryOption: IDataTableQueryOption<IRole>;
    permissions: IExtPermission;
}

export class Role extends PageComponent<RoleProps, RoleState> {
    private access: IAccess;

    constructor(props: RoleProps) {
        super(props);
        this.state = {
            showLoader: false,
            validationErrors: null,
            roles: [],
            queryOption: {page: 1, limit: 100},
            permissions: {}
        };
        this.access = this.auth.getAccessList('role');
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
                this.notif.error(this.tr(error.message));
                this.setState({showLoader: false});
            })
    }

    public fetchAll = () => {
        this.setState({showLoader: true});
        return this.api.get<IRole>('acl/role')
            .then(response => {
                this.setState({showLoader: false, roles: response.items});
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(this.tr(error.message));
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
                this.notif.success(this.tr(`info_${saveType}_record`, `${response.items[0].id}`));
                this.props.history.goBack();
                this.fetchAll();
                this.setState({showLoader: false});
            })
            .catch(error => {
                this.notif.error(this.tr(error.message));
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
                this.notif.error(this.tr(error.message));
                this.setState({showLoader: false});
            })
    }

    public render() {
        return (
            <div className="page role-page has-navbar">
                <PageTitle title={this.tr('mdl_role')}/>
                <Navbar title={this.tr('mdl_role')} showBurger={true}/>
                <h1>{this.tr('mdl_role')}</h1>
                <Preloader show={this.state.showLoader}/>
                <CrudMenu path="role" access={this.access}/>
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            {this.access.add ?
                                <Route path="/role/add"
                                       render={this.tz(RoleAdd, {role: ['add']}, {
                                           save: this.save,
                                           validationErrors: this.state.validationErrors,
                                           permissions: this.state.permissions
                                       })}/> : null}
                            {this.access.edit ?
                                <Route path="/role/edit/:id"
                                       render={this.tz(RoleEdit, {role: ['edit']}, {
                                           save: this.save,
                                           fetch: this.fetch,
                                           validationErrors: this.state.validationErrors,
                                           permissions: this.state.permissions
                                       })}/> : null}
                            <Route path="/role/detail/:id"
                                   render={this.tz(RoleDetail, {role: ['read']}, {
                                       fetch: this.fetch
                                   })}/>
                        </Switch>
                    </DynamicRouter>
                    <RoleList roles={this.state.roles} access={this.access} fetch={this.fetchAll}
                              queryOption={this.state.queryOption}/>
                </div>
            </div>
        )
    }
}

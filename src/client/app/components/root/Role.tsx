import React from "react";
import { Route, Switch } from "react-router";
import { IPermission } from "../../cmn/models/Permission";
import { IRole, Role as RoleModel } from "../../cmn/models/Role";
import { IValidationError } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import { IDataTableQueryOption } from "../general/DataTable";
import { DynamicRouter } from "../general/DynamicRouter";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";
import { RoleAdd } from "./role/RoleAdd";
import { RoleDetail } from "./role/RoleDetail";
import { RoleEdit } from "./role/RoleEdit";
import { RoleList } from "./role/RoleList";

export interface IAction {
    action?: string;
    id: number;
}

export interface IExtPermission {
    [name: string]: Array<IAction>;
}

export interface IRoleParams {
}

export interface IRoleProps extends IPageComponentProps<IRoleParams> {
}

export interface IRoleState {
    permissions?: IExtPermission;
    queryOption: IDataTableQueryOption<IRole>;
    roles: Array<IRole>;
    showLoader?: boolean;
    validationErrors?: IValidationError;
}

export class Role extends PageComponent<IRoleProps, IRoleState> {
    private access: IAccess;

    constructor(props: IRoleProps) {
        super(props);
        this.access = this.auth.getAccessList("role");
        this.state = { roles: [], queryOption: { page: 1, limit: this.pagination.itemsPerPage }, permissions: {} };
        this.access = this.auth.getAccessList("role");
    }

    public componentDidMount() {
        this.fetchPermissions();
    }

    public render() {
        const { validationErrors, permissions } = this.state;

        return (
            <div className="page role-page has-navbar">
                <PageTitle title={this.tr("mdl_role")} />
                <Navbar title={this.tr("mdl_role")} />
                <h1>{this.tr("mdl_role")}</h1>
                <Preloader show={this.state.showLoader} />
                <CrudMenu path="role" access={this.access} />
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            {this.access.add ? <Route path="/role/add" render={this.tz(RoleAdd, { role: ["add"] }, { save: this.onSave, validationErrors, permissions })} /> : null}
                            {this.access.edit ? <Route path="/role/edit/:id" render={this.tz(RoleEdit, { role: ["edit"] }, { save: this.onSave, fetch: this.fetch, validationErrors, permissions })} /> : null}
                            <Route path="/role/detail/:id" render={this.tz(RoleDetail, { role: ["read"] }, { fetch: this.fetch })} />
                        </Switch>
                    </DynamicRouter>
                    <RoleList roles={this.state.roles} access={this.access} fetch={this.fetchAll}
                        queryOption={this.state.queryOption} />
                </div>
            </div>
        );
    }

    private fetch = (id: number) => {
        this.setState({ showLoader: true });
        return this.api.get<IRole>(`acl/role/${id}`)
            .then((response) => {
                this.setState({ showLoader: false });
                return response.items[0];
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
                this.setState({ showLoader: false });
            });
    }

    private fetchAll = () => {
        this.setState({ showLoader: true });
        return this.api.get<IRole>("acl/role")
            .then((response) => {
                this.setState({ showLoader: false, roles: response.items });
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(this.tr(error.message));
            });
    }

    private fetchPermissions = () => {
        this.setState({ showLoader: true });
        if (this.state.permissions.length) { return; }
        this.api.get<IPermission>("acl/permission")
            .then((response) => {
                // converting list of [{resource, action}] => {resource=> [actions]}
                const permissions: IExtPermission = {};
                for (let i = 0, il = response.items.length; i < il; ++i) {
                    const p: IPermission = response.items[i] as IPermission;
                    if (!permissions[p.resource]) {
                        permissions[p.resource] = [];
                    }
                    permissions[p.resource].push({ id: p.id, action: p.action });
                }
                this.setState({ showLoader: false, permissions });
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
                this.setState({ showLoader: false });
            });
    }

    private onSave = (model: IRole) => {
        const role = new RoleModel(model);
        role.status = +role.status;
        const saveType = model.id ? "update" : "add";
        const validationResult = role.validate();
        if (validationResult) {
            return this.setState({ validationErrors: validationResult });
        }
        this.setState({ showLoader: true });
        const data = role.getValues<IRole>();
        (model.id ? this.api.put<IRole>("acl/role", data) : this.api.post<IRole>("acl/role", data))
            .then((response) => {
                this.notif.success(this.tr(`info_${saveType}_record`, `${response.items[0].id}`));
                this.props.history.goBack();
                this.fetchAll();
                this.setState({ showLoader: false });
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
                this.setState({ validationErrors: error.validation, showLoader: false });
            });
    }
}

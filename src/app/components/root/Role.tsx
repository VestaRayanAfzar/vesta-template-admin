import React from "react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
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
    [name: string]: IAction[];
}

interface IRoleParams {
}

interface IRoleProps extends IPageComponentProps<IRoleParams> {
}

interface IRoleState {
}

export class Role extends PageComponent<IRoleProps, IRoleState> {
    private access: IAccess;

    constructor(props: IRoleProps) {
        super(props);
        this.state = {};
        this.access = this.auth.getAccessList("role");
    }

    public render() {
        const add = this.access.add ?
            <Route path="/role/add" render={this.tz(RoleAdd, { role: ["add"] })} /> : null;
        const edit = this.access.edit ?
            <Route path="/role/edit/:id" render={this.tz(RoleEdit, { role: ["edit"] })} /> : null;

        return (
            <div className="page role-page has-navbar">
                <PageTitle title={this.tr("mdl_role")} />
                <Navbar title={this.tr("mdl_role")} />
                <h1>{this.tr("mdl_role")}</h1>
                <CrudMenu path="role" access={this.access} />
                <div className="crud-wrapper">
                    <HashRouter>
                        <Switch>
                            {add}
                            {edit}
                            <Route path="/role/detail/:id" render={this.tz(RoleDetail, { role: ["read"] })} />
                        </Switch>
                    </HashRouter>
                    <RoleList access={this.access} />
                </div>
            </div>
        );
    }
}

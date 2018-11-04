import React from "react";
import { Route, Switch } from "react-router";
import { DynamicRouter } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
import { IPageComponentProps, PageComponent } from "../PageComponent";
import { UserAdd } from "./user/UserAdd";
import { UserDetail } from "./user/UserDetail";
import { UserEdit } from "./user/UserEdit";
import { UserList } from "./user/UserList";

interface IUserParams {
}

interface IUserProps extends IPageComponentProps<IUserParams> {
}

interface IUserState {
}

export class User extends PageComponent<IUserProps, IUserState> {
    private access: IAccess;

    constructor(props: IUserProps) {
        super(props);
        this.state = {};
        this.access = this.auth.getAccessList("user");
    }

    public render() {
        const { add, edit } = this.access;
        const addUser = add ?
            <Route path="/user/add" render={this.tz(UserAdd, { user: ["add"] })} /> : null;
        const editUser = edit ?
            <Route path="/user/edit/:id" render={this.tz(UserEdit, { user: ["edit"] })} /> : null;

        return (
            <div className="page user-page has-navbar">
                <PageTitle title={this.tr("mdl_user")} />
                <Navbar title={this.tr("mdl_user")} showBurger={true} />
                <h1>{this.tr("users")}</h1>
                <CrudMenu path="user" access={this.access} />

                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            {addUser}
                            {editUser}
                            <Route path="/user/detail/:id" render={this.tz(UserDetail, { user: ["read"] })} />
                        </Switch>
                    </DynamicRouter>
                    <UserList access={this.access} />
                </div>
            </div>
        );
    }
}

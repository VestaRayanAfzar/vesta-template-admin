import React from "react";
import { Route, Switch } from "react-router";
import { IRole } from "../../cmn/models/Role";
import { IUser, User as UserModel } from "../../cmn/models/User";
import { IValidationError } from "../../medium";
import { DynamicRouter } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import { IDataTableQueryOption } from "../general/DataTable";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
import { Preloader } from "../general/Preloader";
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
    queryOption: IDataTableQueryOption<IUser>;
    roles: IRole[];
    showLoader?: boolean;
    users: IUser[];
    validationErrors?: IValidationError;
}

export class User extends PageComponent<IUserProps, IUserState> {
    private access: IAccess;

    constructor(props: IUserProps) {
        super(props);
        this.access = this.auth.getAccessList("user");
        this.state = { users: [], queryOption: { page: 1, limit: this.pagination.itemsPerPage }, roles: [] };
    }

    public componentDidMount() {
        this.setState({ showLoader: true });
        this.fetchRoles();
    }

    public render() {
        const { showLoader, users, queryOption, validationErrors, roles } = this.state;
        return (
            <div className="page user-page has-navbar">
                <PageTitle title={this.tr("mdl_user")} />
                <Navbar title={this.tr("mdl_user")} showBurger={true} />
                <h1>{this.tr("users")}</h1>
                <Preloader show={showLoader} />
                <CrudMenu path="user" access={this.access} />
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            {this.access.add ? <Route path="/user/add" render={this.tz(UserAdd, { user: ["add"] }, { save: this.save, validationErrors, roles })} /> : null}
                            {this.access.edit ? <Route path="/user/edit/:id" render={this.tz(UserEdit, { user: ["edit"] }, { save: this.save, fetch: this.onFetch, validationErrors, roles })} /> : null}
                            <Route path="/user/detail/:id" render={this.tz(UserDetail, { user: ["read"] }, { fetch: this.onFetch })} />
                        </Switch>
                    </DynamicRouter>
                    <UserList access={this.access} fetch={this.onFetchAll} queryOption={queryOption}
                        users={users} />
                </div>
            </div>
        );
    }

    private fetchRoles = () => {
        this.setState({ showLoader: true });
        this.api.get<IRole>("acl/role")
            .then((response) => {
                this.setState({ showLoader: false, roles: response.items });
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(this.tr(error.message));
            });
    }

    private onFetch = (id: number) => {
        this.setState({ showLoader: true });
        return this.api.get<IUser>(`user/${id}`)
            .then((response) => {
                this.setState({ showLoader: false });
                return response.items[0];
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
            });
    }

    private onFetchAll = (queryOption: IDataTableQueryOption<IUser>) => {
        this.setState({ showLoader: true, queryOption });
        this.onFetchCount(queryOption);
        this.api.get<IUser>("user", queryOption)
            .then((response) => {
                this.setState({ showLoader: false, users: response.items });
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(this.tr(error.message));
            });
    }

    private onFetchCount = (queryOption: IDataTableQueryOption<IUser>) => {
        this.api.get<IUser>("user/count", queryOption)
            .then((response) => {
                this.state.queryOption.total = response.total;
                this.setState({ queryOption: this.state.queryOption });
            })
            .catch((error) => {
                this.state.queryOption.total = 0;
                this.setState({ queryOption: this.state.queryOption });
                this.notif.error(this.tr(error.message));
            });
    }

    private save = (model: IUser) => {
        const user = new UserModel(model);
        const saveType = user.id ? "update" : "add";
        let hasFile = false;
        const userFiles: IUser = {};
        if (user.image) {
            userFiles.image = user.image;
            delete user.image;
            hasFile = true;
        }
        const validationResult = user.validate();
        if (validationResult) {
            if (!user.password) {
                delete validationResult.password;
            }
            if (Object.keys(validationResult).length) {
                return this.setState({ validationErrors: validationResult });
            }
        }
        this.setState({ showLoader: true });
        const data = user.getValues<IUser>();
        (model.id ? this.api.put<IUser>("user", data) : this.api.post<IUser>("user", data))
            // tslint:disable-next-line:max-line-length
            .then((response) => hasFile ? this.api.upload<IUser>(`user/file/${response.items[0].id}`, userFiles) : response)
            .then((response) => {
                this.setState({ showLoader: false });
                this.notif.success(this.tr(`info_${saveType}_record`, `${response.items[0].id}`));
                this.onFetchAll(this.state.queryOption);
                this.props.history.goBack();
            })
            .catch((error) => {
                this.setState({ showLoader: false, validationErrors: error.validation });
                this.notif.error(this.tr(error.message));
            });
    }
}

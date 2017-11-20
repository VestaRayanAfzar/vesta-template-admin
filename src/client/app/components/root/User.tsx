import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {Route, Switch} from "react-router";
import {IDataTableQueryOption} from "../general/DataTable";
import {PageTitle} from "../general/PageTitle";
import {Preloader} from "../general/Preloader";
import {CrudMenu} from "../general/CrudMenu";
import {IAccess} from "../../service/AuthService";
import {IUser, User as UserModel} from "../../cmn/models/User";
import {UserAdd} from "./user/UserAdd";
import {UserEdit} from "./user/UserEdit";
import {UserDetail} from "./user/UserDetail";
import {UserList} from "./user/UserList";
import {IRole} from "../../cmn/models/Role";
import {DynamicRouter} from "../general/DynamicRouter"
import {IValidationError} from "../../cmn/core/Validator";

export interface UserParams {
}

export interface UserProps extends PageComponentProps<UserParams> {
}

export interface UserState extends PageComponentState {
    showLoader: boolean;
    validationErrors: IValidationError;
    users: Array<IUser>;
    queryOption: IDataTableQueryOption<IUser>;
    roles: Array<IRole>;
}

export class User extends PageComponent<UserProps, UserState> {
    private access: IAccess;

    constructor(props: UserProps) {
        super(props);
        this.access = this.auth.getAccessList('user');
        this.state = {
            showLoader: false,
            validationErrors: null,
            users: [],
            queryOption: {page: 1, limit: this.pagination.itemsPerPage},
            roles: []
        };
    }

    public componentDidMount() {
        this.setState({showLoader: true});
        this.fetchRoles();
    }

    public fetch = (id: number) => {
        this.setState({showLoader: true});
        return this.api.get<IUser>(`user/${id}`)
            .then(response => {
                this.setState({showLoader: false});
                return response.items[0];
            })
            .catch(error => {
                this.notif.error(this.tr(error.message));
            })
    }

    private fetchCount = (queryOption: IDataTableQueryOption<IUser>) => {
        this.api.get<IUser>('user/count', queryOption)
            .then(response => {
                this.state.queryOption.total = response.total;
                this.setState({queryOption: this.state.queryOption});
            })
            .catch(error => {
                this.state.queryOption.total = 0;
                this.setState({queryOption: this.state.queryOption});
                this.notif.error(this.tr(error.message));
            })
    }

    public fetchAll = (queryOption: IDataTableQueryOption<IUser>) => {
        this.setState({showLoader: true, queryOption});
        this.fetchCount(queryOption);
        this.api.get<IUser>('user', queryOption)
            .then(response => {
                this.setState({showLoader: false, users: response.items});
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(this.tr(error.message));
            })
    }

    public save = (model: IUser) => {
        let user = new UserModel(model);
        const saveType = user.id ? 'update' : 'add';
        let hasFile = false;
        let userFiles: IUser = {};
        if (user.image) {
            userFiles.image = user.image;
            delete user.image;
            hasFile = true;
        }
        let validationResult = user.validate();
        if (validationResult) {
            if (!user.password) {
                delete validationResult.password;
            }
            if (Object.keys(validationResult).length) {
                return this.setState({validationErrors: validationResult});
            }
        }
        this.setState({showLoader: true});
        let data = user.getValues<IUser>();
        (model.id ? this.api.put<IUser>('user', data) : this.api.post<IUser>('user', data))
            .then(response => hasFile ? this.api.upload<IUser>('user/file', response.items[0].id, userFiles) : response)
            .then(response => {
                this.setState({showLoader: false});
                this.notif.success(this.tr(`info_${saveType}_record`, `${response.items[0].id}`));
                this.fetchAll(this.state.queryOption);
                this.props.history.goBack();
            })
            .catch(error => {
                this.setState({showLoader: false, validationErrors: error.validation});
                this.notif.error(this.tr(error.message));
            })
    }

    public fetchRoles = () => {
        this.setState({showLoader: true});
        this.api.get<IRole>('acl/role')
            .then(response => {
                this.setState({showLoader: false, roles: response.items});
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(this.tr(error.message));
            })
    }

    public render() {
        let {showLoader, users, queryOption, validationErrors, roles} = this.state;
        return (
            <div className="page user-page has-navbar">
                <PageTitle title={this.tr('users')}/>
                <Navbar title={this.tr('users')} showBurger={true}/>
                <h1>{this.tr('users')}</h1>
                <Preloader show={showLoader}/>
                <CrudMenu path="user" access={this.access}/>
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            {this.access.add ?
                                <Route path="/user/add"
                                       render={this.tz(UserAdd, {user: ['add']}, {
                                           save: this.save, validationErrors, roles
                                       })}/> : null}
                            {this.access.edit ?
                                <Route path="/user/edit/:id"
                                       render={this.tz(UserEdit, {user: ['edit']}, {
                                           save: this.save, fetch: this.fetch, validationErrors, roles
                                       })}/> : null}
                            <Route path="/user/detail/:id"
                                   render={this.tz(UserDetail, {user: ['read']}, {
                                       fetch: this.fetch
                                   })}/>
                        </Switch>
                    </DynamicRouter>
                    <UserList access={this.access} fetch={this.fetchAll} queryOption={queryOption}
                              users={users}/>
                </div>
            </div>
        )
    }
}

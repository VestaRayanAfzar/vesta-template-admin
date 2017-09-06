import * as React from "react";
import {Component} from "react";
import {Link} from "react-router-dom";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {Dispatcher} from "../service/Dispatcher";
import {IQueryResult} from "../medium";
import {Menu} from "./general/Menu";
import {ToastMessage} from "./general/ToastMessage";
import {RouteItem} from "../config/route";
import {IUser} from "../cmn/models/User";

export interface RootProps {
    routeItems: Array<RouteItem>;
}

interface RootState {
    user: IUser;
}

export class Root extends Component<RootProps, RootState> {
    private api = ApiService.getInstance();
    private auth = AuthService.getInstance();

    public componentDidMount() {
        Dispatcher.getInstance().register<{ user: IUser }>(AuthService.Events.Update, (payload) => {
            this.setState({user: payload.user});
        });
        this.api.get<IQueryResult<IUser>>('account')
            .then(response => {
                if (response) {
                    this.auth.login(response.items[0]);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    public render() {
        return (
            <div id="main-wrapper">
                <ToastMessage/>
                <header id="main-header">
                    <Menu name="app-menu" items={this.props.routeItems}/>
                </header>
                <main id="main-content">
                    <div id="content-wrapper">
                        {this.props.children}
                    </div>
                </main>
            </div>
        );
    }
}

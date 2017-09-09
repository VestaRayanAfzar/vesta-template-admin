import * as React from "react";
import {Component} from "react";
import {Link} from "react-router-dom";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {Dispatcher} from "../service/Dispatcher";
import {IQueryResult} from "../medium";
import {ToastMessage} from "./general/ToastMessage";
import {RouteItem} from "../config/route";
import {IUser} from "../cmn/models/User";
import Navbar from "./general/Navbar";
import {Sidenav} from "./general/Sidenav";
import {SidenavContent} from "./general/SidenavContent";

export interface RootProps {
    routeItems: Array<RouteItem>;
}

interface RootState {
    user: IUser;
}

export class Root extends Component<RootProps, RootState> {
    private api = ApiService.getInstance();
    private auth = AuthService.getInstance();
    private dispatcher = Dispatcher.getInstance();

    constructor(props: RootProps) {
        super(props);
        this.state = {user: null};
    }

    public componentDidMount() {
        this.dispatcher.register<{ user: IUser }>(AuthService.Events.Update, (payload) => {
            this.setState({user: payload.user});
        });
        this.api.get<IQueryResult<IUser>>('me')
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
                    <Navbar routeItems={this.props.routeItems}/>
                </header>
                <main id="main-content">
                    <div id="content-wrapper">
                        {this.props.children}
                    </div>
                </main>
                <Sidenav name="main-sidenav">
                    <SidenavContent name="main-sidenav" user={this.state.user} menuItems={this.props.routeItems}/>
                </Sidenav>
            </div>
        );
    }
}

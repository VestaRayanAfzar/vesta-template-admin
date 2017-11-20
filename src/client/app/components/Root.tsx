import React, {Component} from "react";
import {Link} from "react-router-dom";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {Dispatcher} from "../service/Dispatcher";
import {ToastMessage} from "./general/ToastMessage";
import {RouteItem} from "../config/route";
import {IUser} from "../cmn/models/User";
import {Sidenav} from "./general/Sidenav";
import {SidenavContent} from "./general/SidenavContent";
import {Html} from "./general/Html";
import {LogService} from "../service/LogService";
import {Culture} from "../cmn/core/Culture";

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
        this.api.get<IUser>('me')
            .then(response => {
                this.auth.login(response.items[0]);
            })
            .catch(err => {
                LogService.error(err, 'componentDidMount', 'Root');
            });
    }

    public render() {
        const {code, dir} = Culture.getLocale();
        return (
            <div id="main-wrapper">
                <Html lang={code} dir={dir}/>
                <div id="content-wrapper">
                    {this.props.children}
                </div>
                <Sidenav name="main-sidenav">
                    <SidenavContent name="main-sidenav" user={this.state.user} menuItems={this.props.routeItems}/>
                </Sidenav>
                <ToastMessage/>
            </div>
        )
    }
}

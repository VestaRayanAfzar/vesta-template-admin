import React, { Component, ComponentType } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IUser } from "../cmn/models/User";
import { IRouteItem } from "../config/route";
import { Culture } from "../medium";
import { ApiService } from "../service/ApiService";
import { AuthService } from "../service/AuthService";
import { Dispatcher } from "../service/Dispatcher";
import { LogService } from "../service/LogService";
import { Html } from "./general/Html";
import { Sidenav } from "./general/Sidenav";
import { SidenavContent } from "./general/SidenavContent";
import { ToastMessage } from "./general/ToastMessage";

interface IRootParams { }

interface IRootProps extends RouteComponentProps<IRootParams> {
    routeItems: IRouteItem[];
}

interface IRootState {
    user: IUser;
}

class Root extends Component<IRootProps, IRootState> {
    private api = ApiService.getInstance();
    private auth = AuthService.getInstance();
    private dispatcher = Dispatcher.getInstance();

    constructor(props: IRootProps) {
        super(props);
        this.state = { user: this.auth.getUser() };
    }

    public componentDidMount() {
        // registering for user auth status change event
        this.dispatcher.register<IUser>(AuthService.Events.Update, (user) => {
            this.setState({ user });
        });
        // updating user information from API
        this.api.get<IUser>("me")
            .then((response) => this.auth.login(response.items[0]))
            .catch((err) => LogService.error(err, "componentDidMount", "Root"));
    }

    public render() {
        const { user } = this.state;
        const { routeItems } = this.props;
        const { code, dir } = Culture.getLocale();

        return (
            <div id="main-wrapper" className="root-component">
                <Html lang={code} dir={dir} />
                <div id="content-wrapper">
                    {this.props.children}
                </div>
                <Sidenav name="main-sidenav">
                    <SidenavContent name="main-sidenav" user={user} menuItems={routeItems} />
                </Sidenav>
                <ToastMessage />
            </div>
        );
    }
}

export default withRouter(Root as ComponentType<IRootProps>);

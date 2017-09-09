import React from "react";
import {RouteItem} from "../../config/route";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";
import {Dispatcher} from "../../service/Dispatcher";
import {Burger} from "./Burger";

export interface NavbarProps extends PageComponentProps<any> {
    routeItems: Array<RouteItem>;
}

export interface NavbarState {
    title: string;
}

class Navbar extends React.Component<NavbarProps, NavbarState> {
    private dispatcher = Dispatcher.getInstance();

    constructor(props: NavbarProps) {
        super(props);
        this.state = {title: ''};
    }

    private findRoute() {
        // console.log(this.props);
        let item: RouteItem = null;
        let routeItems = this.props.routeItems;
        for (let i = routeItems.length; i--;) {
            if (`/${routeItems[i].link}` == this.props.location.pathname) {
                item = routeItems[i];
                break;
            }
        }
        return item;
    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    public render() {
        let routeItem = this.findRoute();
        let title = '';
        let backBtn = null;
        if (routeItem) {
            title = routeItem.title;
            backBtn = routeItem.link ? <span className="nav-btn" onClick={this.props.history.goBack}>&gt;</span> : null;
        }
        return (
            <div className="page navbar-component">
                <Burger className="nav-btn" event="main-sidenav-toggle" />
                <p className="nav-title">{title}</p>
                {backBtn}
            </div>
        );
    }
}

export default withRouter(Navbar);
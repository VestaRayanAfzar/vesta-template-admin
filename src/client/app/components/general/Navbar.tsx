import React from "react";
import {RouteItem} from "../../config/route";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";

export interface NavbarProps extends PageComponentProps<any> {
    routeItems: Array<RouteItem>;
}

export interface NavbarState {
    title: string;
}

class Navbar extends React.Component<NavbarProps, NavbarState> {

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
        let title = routeItem && routeItem.title;
        let backBtn = routeItem.link ? <span className="nav-btn" onClick={this.props.history.goBack}>&gt;</span> : null;
        return (
            <div className="page navbar-component">
                <h3 className="nav-title">{title}</h3>
                {backBtn}
            </div>
        );
    }
}

export default withRouter(Navbar);
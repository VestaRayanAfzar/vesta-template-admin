import React, { ComponentType, PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Burger } from "./Burger";

export enum NavBarMainButtonType { Burger = 1, Back, Close }

interface INavbarParams { }

interface INavbarProps extends RouteComponentProps<INavbarParams> {
    title?: string;
    className?: string;
    backLink?: string;
    backAction?: (e) => void;
    showBurger?: boolean;
    hide?: boolean;
    mainButtonType?: NavBarMainButtonType;
}

class Navbar extends PureComponent<INavbarProps, null> {

    public render() {
        const { title, className, backLink, showBurger, hide, backAction, mainButtonType } = this.props;
        if (hide) { return null; }
        let btnClassName = "back-btn";
        if (mainButtonType == NavBarMainButtonType.Close) {
            btnClassName = "close-btn";
        }
        const navBtn = (showBurger || location.pathname == "/") && !backLink && !backAction ?
            <Burger className="nav-btn" event="main-sidenav-toggle" /> :
            <Burger className={`nav-btn ${btnClassName}`} onClick={this.goBack} />;

        return (
            <div className={`navbar ${className}`}>
                {navBtn}
                <p className="nav-title">{title || ""}</p>
                <div className="navbar-btn-group">
                    {this.props.children}
                </div>
            </div>
        );
    }

    private goBack = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const { backAction } = this.props;
        if (backAction) {
            return backAction(e);
        }
        const { history, backLink } = this.props;
        if (backLink) { return history.replace(backLink); }
        if (history.length) { return history.goBack(); }
        history.replace("/");
    }
}

export default withRouter(Navbar as ComponentType<INavbarProps>);

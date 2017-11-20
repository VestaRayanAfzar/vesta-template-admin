import React, {PureComponent} from "react";
import {withRouter} from "react-router";
import {BaseComponentProps} from "../BaseComponent";
import {Link} from "react-router-dom";
import {Burger} from "./Burger";

export interface NavbarProps extends BaseComponentProps {
    title?: string;
    className?: string;
    backLink?: string;
    backAction?: (e) => void;
    showBurger?: boolean;
    hide?: boolean;
}

class Navbar extends PureComponent<NavbarProps, null> {

    private goBack = (e) => {
        e && e.stopPropagation();
        const {backAction} = this.props;
        if (backAction) {
            return backAction(e);
        }
        const {history, backLink} = this.props;
        if (backLink) return history.replace(backLink);
        if (history.length) return history.goBack();
        history.replace('/');
    }

    public render() {
        let {title, className, backLink, showBurger, hide, backAction} = this.props;
        if (hide) return null;
        className = `navbar ${className || ''}`;
        title = title || '';
        let navBtn = (showBurger || location.pathname == '/') && !backLink && !backAction ?
            <Burger className="nav-btn" event="main-sidenav-toggle"/> :
            <Burger className="nav-btn back-btn" onClick={this.goBack}/>;

        return (
            <div className={className}>
                {navBtn}
                <p className="nav-title">{title}</p>
                <div className="navbar-btn-group">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default withRouter(Navbar);
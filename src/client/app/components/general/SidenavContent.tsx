import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import {BaseComponentProps} from "../BaseComponent";
import {Dispatcher} from "../../service/Dispatcher";
import {Menu, MenuItem} from "./Menu";
import {IUser} from "../../cmn/models/User";
import {Avatar} from "./Avatar";
import {Util} from "../../util/Util";
import {Icon} from "./Icon";

export interface SideNavContentProps extends BaseComponentProps {
    name: string;
    menuItems: Array<MenuItem>;
    user: IUser;
}

export class SidenavContent extends PureComponent<SideNavContentProps, null> {
    private dispatch = Dispatcher.getInstance().dispatch;

    private closeSidenav = () => {
        this.dispatch(`${this.props.name}-close`, null);
        return true;
    }

    public render() {
        let {user, menuItems} = this.props;
        user = user || {};
        const editLink = user && user.id ? <Link to="/profile" onClick={this.closeSidenav}><Icon name="setting"/></Link> : null;
            let userImage = null;
        if (user.image) {
            userImage = Util.getFileUrl(`user/${user.image}`);
        }
        return (
            <div className="sidenav-content">
                <header>
                    <Avatar src={userImage as string} defaultSrc="img/vesta-logo.png"/>
                    <div className="name-wrapper">
                        <h4>{user.name}</h4>
                        {editLink}
                    </div>
                </header>
                <main>
                    <Menu name="nav-menu" items={menuItems} onClick={this.closeSidenav}/>
                </main>
            </div>
        );
    }
}
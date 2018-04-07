import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../cmn/models/User";
import { Dispatcher } from "../../service/Dispatcher";
import { getFileUrl } from "../../util/Util";
import { IBaseComponentProps } from "../BaseComponent";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { IMenuItem, Menu } from "./Menu";

interface ISideNavContentProps extends IBaseComponentProps {
    menuItems: IMenuItem[];
    name: string;
    user: IUser;
}

export class SidenavContent extends PureComponent<ISideNavContentProps, null> {
    private dispatch = Dispatcher.getInstance().dispatch;

    public render() {
        const { user = {}, menuItems } = this.props;
        const editLink = user && user.id ?
            <Link to="/profile" onClick={this.closeSidenav}><Icon name="settings" /></Link> : null;
        let userImage: string = "";
        if (user.image) {
            userImage = getFileUrl(`user/${user.image}`);
        }
        return (
            <div className="sidenav-content">
                <header>
                    <Avatar src={userImage} defaultSrc="img/icons/192x192.png" />
                    <div className="name-wrapper">
                        <h4>{user.username}</h4>
                        {editLink}
                    </div>
                </header>
                <main>
                    <Menu name="nav" items={menuItems} onItemSelect={this.closeSidenav} />
                </main>
            </div>
        );
    }

    private closeSidenav = () => {
        this.dispatch(`${this.props.name}-close`, null);
        return true;
    }
}

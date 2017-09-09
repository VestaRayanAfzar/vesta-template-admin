import React from "react";
import {Link} from "react-router-dom";
import {Dispatcher} from "../../service/Dispatcher";
import {Menu, MenuItem} from "./Menu";
import {IUser} from "../../cmn/models/User";

export interface SideNavContentProps {
    name: string;
    menuItems: Array<MenuItem>;
    user: IUser;
}

export const SidenavContent = (props: SideNavContentProps) => {
    const user = props.user || {};

    return (
        <div className="sidenav-content">
            <header>
                <div className="user-image-wrapper">
                    <img src="img/vesta-logo.png"/>
                </div>
                <div className="name-wrapper">
                    <h4>{user.username}</h4>
                    <span>Vesta Control Panel Template</span>
                </div>
            </header>
            <Menu name="nav-menu" items={props.menuItems} itemClick={closeSidenav}/>
        </div>
    );

    function closeSidenav() {
        Dispatcher.getInstance().dispatch(`${props.name}-close`, null);
        return true;
    }
};

import React from "react";
import {Link} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";
import {RouteItem} from "../../config/route";

export interface MenuItem extends RouteItem {

}

export interface MenuParams {
}

export interface MenuProps extends PageComponentProps<MenuParams> {
    name: string;
    items: Array<MenuItem>;
}

export const Menu = (props: MenuProps) => {
    const menuItems = (props.items || [])
        .map((item: MenuItem, i) => <li key={i}><Link to={`/${item.link}`}>{item.title}</Link></li>);
    const className = `menu-component ${props.name}`;

    return (
        <div className={className}>
            <ul>{menuItems}</ul>
        </div>
    )

};
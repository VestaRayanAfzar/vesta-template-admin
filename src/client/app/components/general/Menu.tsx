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
    itemClick?: (e: MouseEvent) => boolean;
    horizontal?: boolean;
}

export const Menu = (props: MenuProps) => {
    let clickHandler = props.itemClick || null;
    const menuItems = (props.items || [])
        .map((item: MenuItem, i) => <li key={i}>
            <Link to={`/${item.link}`} onClick={clickHandler}>{item.title}</Link>
        </li>);
    const className = `menu-component ${props.name} ${props.horizontal ? 'horizontal' : 'vertical'}`;

    return (
        <nav className={className}>
            <ul>{menuItems}</ul>
        </nav>
    )
};
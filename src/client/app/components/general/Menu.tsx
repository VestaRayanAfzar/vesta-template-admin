import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import {RouteItem} from "../../config/route";
import {BaseComponentProps} from "../BaseComponent";

export interface MenuItem extends RouteItem {

}

export interface MenuProps extends BaseComponentProps {
    name: string;
    items: Array<MenuItem>;
    onClick?: (e: MouseEvent) => boolean;
    horizontal?: boolean;
}

export class Menu extends PureComponent<MenuProps, null> {
    private keyCounter = 1;

    private renderMenuItems(routeItems: Array<RouteItem>, prefix: string) {
        let {onClick} = this.props;
        let links = [];
        const routeCount = routeItems.length;
        for (let i = 0, il = routeCount; i < il; ++i) {
            const item = routeItems[i];
            if (!item.abstract) {
                let basePath = prefix ? `/${prefix}` : '';
                links.push(
                    <li key={this.keyCounter++}>
                        <Link to={`${basePath}/${item.link}`} onClick={onClick}>{item.title}</Link>
                    </li>);
            }
            if (item.children) {
                links = links.concat(this.renderMenuItems(item.children, item.link));
            }
        }
        return links;
    }

    public render() {
        let {name, items, horizontal} = this.props;
        const menuItems = this.renderMenuItems(items, '');

        const className = `menu-component ${name} ${horizontal ? 'horizontal' : 'vertical'}`;

        return (
            <nav className={className}>
                <ul>{menuItems}</ul>
            </nav>
        )
    }
}
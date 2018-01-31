import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import {RouteItem} from "../../config/route";
import {BaseComponentProps} from "../BaseComponent";
import {Icon} from "./Icon";

export interface MenuItem extends RouteItem {

}

export interface MenuProps extends BaseComponentProps {
    name: string;
    items: Array<MenuItem>;
    onClick?: (e: MouseEvent) => boolean;
    horizontal?: boolean;
}

export class Menu extends PureComponent<MenuProps, null> {
    public static defaultProps = {horizontal: false};
    private keyCounter = 1;

    private renderMenuItems(routeItems: Array<RouteItem>, prefix: string) {
        let {onClick} = this.props;
        let links = [];
        const routeCount = routeItems.length;
        for (let i = 0, il = routeCount; i < il; ++i) {
            const item = routeItems[i];
            if (!item.abstract && !item.hidden) {
                let basePath = prefix ? `/${prefix}` : '';
                let content = item.icon ? <Icon name={item.icon}/> : item.title;
                links.push(
                    <li key={this.keyCounter++}>
                        <Link to={`${basePath}/${item.link}`} onClick={onClick}>{content}</Link>
                    </li>);
            }
            if (item.children) {
                links = links.concat(this.renderMenuItems(item.children, item.link));
            }
        }
        return links;
    }

    public render() {
        const {name, items, horizontal} = this.props;
        const menuItems = this.renderMenuItems(items, '');
        const className = `menu ${name ? `${name}-menu` : ''} ${horizontal ? 'menu-hr' : 'menu-vr'}`;

        return (
            <nav className={className}>
                <ul>{menuItems}</ul>
            </nav>
        )
    }
}
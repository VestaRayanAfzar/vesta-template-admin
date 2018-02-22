import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { IRouteItem } from "../../config/route";
import { IBaseComponentProps } from "../BaseComponent";
import { Icon } from "./Icon";

export interface IMenuItem extends IRouteItem { }

interface IMenuProps extends IBaseComponentProps {
    horizontal?: boolean;
    items: Array<IMenuItem>;
    name: string;
    onClick?: (e: MouseEvent) => boolean;
}

export class Menu extends PureComponent<IMenuProps, null> {
    public static defaultProps = { horizontal: false };
    private keyCounter = 1;

    public render() {
        const { name, items, horizontal } = this.props;
        const menuItems = this.renderMenuItems(items, "");
        const className = `menu ${name ? `${name}-menu` : ""} ${horizontal ? "menu-hr" : "menu-vr"}`;

        return (
            <nav className={className}>
                <ul>{menuItems}</ul>
            </nav>
        );
    }

    private renderMenuItems(routeItems: Array<IRouteItem>, prefix: string) {
        const { onClick } = this.props;
        let links = [];
        const routeCount = routeItems.length;
        for (let i = 0, il = routeCount; i < il; ++i) {
            const item = routeItems[i];
            if (!item.abstract && !item.hidden) {
                const basePath = prefix ? `/${prefix}` : "";
                const content = item.icon ? <Icon name={item.icon} /> : item.title;
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
}

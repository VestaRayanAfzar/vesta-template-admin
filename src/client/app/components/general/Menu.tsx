import React, { MouseEvent, PureComponent } from "react";
import { Link } from "react-router-dom";
import { IRouteItem } from "../../config/route";
import { IBaseComponentProps } from "../BaseComponent";
import { Icon } from "./Icon";

export interface IMenuItem extends IRouteItem {
    id?: string;
    disabled?: boolean;
}

interface IMenuProps extends IBaseComponentProps {
    horizontal?: boolean;
    items: IMenuItem[];
    name?: string;
    onItemSelect?: (id?: string) => void;
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

    private renderMenuItems(routeItems: IRouteItem[], prefix: string) {
        // const { onClick } = this.props;
        let links = [];
        const routeCount = routeItems.length;
        for (let i = 0, il = routeCount; i < il; ++i) {
            const item: IMenuItem = routeItems[i];
            if (!item.abstract && !item.hidden) {
                const basePath = prefix ? `/${prefix}` : "";
                const icon = <Icon name={item.icon} />;
                const className = `menu-item ${item.disabled ? "disabled" : ""}`;
                const itemComponent = item.link ?
                    (<Link to={`${basePath}/${item.link}`}>
                        <span>{icon} {item.title}</span>
                    </Link>) :
                    <a data-id={item.id}>{icon} {item.title}</a>;
                links.push(
                    <li key={this.keyCounter++} className={className} data-id={item.id} onClick={this.onItemClick}>
                        {itemComponent}
                    </li>);
            }
            if (item.children) {
                links = links.concat(this.renderMenuItems(item.children, item.link));
            }
        }
        return links;
    }

    private onItemClick = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const id = e.currentTarget.getAttribute("data-id");
        const { onItemSelect } = this.props;
        if (onItemSelect) {
            onItemSelect(id);
        }
    }
}

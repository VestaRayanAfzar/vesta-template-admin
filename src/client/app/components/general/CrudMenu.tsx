import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { IAccess } from "../../service/AuthService";
import { IBaseComponentProps } from "../BaseComponent";
import { Icon } from "./Icon";

export interface ICrudMenuProps extends IBaseComponentProps {
    path: string;
    access?: IAccess;
}

export class CrudMenu extends PureComponent<ICrudMenuProps, null> {

    public render() {
        let key = 1;
        const { access, path } = this.props;
        const links = [<li key={key++}><Link to={`/${path}`}><Icon name="list" /></Link></li>];
        if (access && access.add) {
            links.push(<li key={key}><Link to={`/${path}/add`}><Icon name="add" /></Link></li>);
        }
        return (
            <div className="crudMenu-component">
                <ul>{links}</ul>
            </div>
        );
    }
}

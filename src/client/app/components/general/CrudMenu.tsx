import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import {BaseComponentProps} from "../BaseComponent";
import {IAccess} from "../../service/AuthService";

export interface CrudMenuProps extends BaseComponentProps {
    path: string;
    access?: IAccess
}

export class CrudMenu extends PureComponent<CrudMenuProps, null> {

    public render() {
        let key = 1;
        let {access, path} = this.props;
        const links = [
            <li key={key++}><Link to={`/${path}`}>List</Link></li>
        ];
        if (access && access.add) {
            links.push(<li key={key}><Link to={`/${path}/add`}>Add</Link></li>);
        }
        return (
            <div className="crudMenu-component">
                <ul>{links}</ul>
            </div>
        )
    }
}
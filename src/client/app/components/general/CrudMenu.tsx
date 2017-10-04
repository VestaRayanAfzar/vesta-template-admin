import React from "react";
import {Link} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";

export interface CrudMenuParams {
}

export interface CrudMenuProps extends PageComponentProps<CrudMenuParams> {
    path: string;
}

export const CrudMenu = (props: CrudMenuProps) => {
    let key = 1;
    const links = [
        <li key={key++}><Link to={`/${props.path}`}>List</Link></li>,
        <li key={key}><Link to={`/${props.path}/add`}>Add</Link></li>
    ];
    return (
        <div className="crudMenu-component">
            <ul>{links}</ul>
        </div>
    )
};
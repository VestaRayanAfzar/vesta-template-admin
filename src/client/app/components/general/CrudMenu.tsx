import React from "react";
import {Link} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";

export interface CrudMenuParams {
}

export interface CrudMenuProps extends PageComponentProps<CrudMenuParams> {
    path: string;
    id?: number;
}

export const CrudMenu = (props: CrudMenuProps) => {
    let key = 1;
    const links = [
        <li key={key++}><Link to={`/${props.path}`}>List</Link></li>,
        <li key={key++}><Link to={`/${props.path}/add`}>Add</Link></li>
    ];
    if (props.id) {
        links.push(<li key={key++}><Link to={`/${props.path}/detail/${props.id}`}>Detail</Link></li>);
        links.push(<li key={key++}><Link to={`/${props.path}/edit/${props.id}`}>Edit</Link></li>);
    }
    return (
        <div className="crudMenu-component">
            <ul>{links}</ul>
        </div>
    )
};
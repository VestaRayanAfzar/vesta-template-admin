import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IRole} from "../../../cmn/models/Role";
import {IPermission} from "../../../cmn/models/Permission";
import {IPermissionCollection} from "../../../service/AuthService";

export interface RoleDetailParams {
    id: number;
}

export interface RoleDetailProps extends PageComponentProps<RoleDetailParams> {
    role: IRole;
    fetch: FetchById<IRole>;
}

export interface RoleDetailState extends PageComponentState {
    role: IRole;
}

export class RoleDetail extends PageComponent<RoleDetailProps, RoleDetailState> {

    constructor(props: RoleDetailProps) {
        super(props);
        this.state = {role: {}};
    }

    public componentDidMount() {
        this.props.fetch(+this.props.match.params.id)
            .then(role => this.setState({role}));
    }

    public render() {
        let role = this.state.role;
        if (!role || !role.name) return null;
        const tr = this.tr.translate;
        let permissions: IPermissionCollection = {};
        for (let i = 0, il = role.permissions.length; i < il; ++i) {
            const p: IPermission = role.permissions[i] as IPermission;
            if (!permissions[p.resource]) {
                permissions[p.resource] = [];
            }
            permissions[p.resource].push(p.action);
        }
        let permissionElements = [];
        for (let resources = Object.keys(permissions), i = 0, il = resources.length; i < il; ++i) {
            permissionElements.push(<tr key={i}>
                <td>{resources[i]}</td>
                <td>{permissions[resources[i]].join(', ')}</td>
            </tr>)
        }
        const statusOptions = {1: tr('enum_active'), 0: tr('enum_inactive')};
        return (
            <div className="page roleDetail-component">
                <table className="spec-table">
                    <thead>
                    <tr>
                        <th colSpan={2}>Role #{role.id}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{tr('fld_name')}</td>
                        <td>{role.name}</td>
                    </tr>
                    <tr>
                        <td>{tr('fld_desc')}</td>
                        <td>{role.desc}</td>
                    </tr>
                    <tr>
                        <td>{tr('fld_status')}</td>
                        <td>{statusOptions[role.status]}</td>
                    </tr>
                    <tr>
                        <td>{tr('fld_permission')}</td>
                        <td>
                            <table>
                                <thead>
                                <tr>
                                    <th>{tr('fld_resource')}</th>
                                    <th>{tr('fld_action')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {permissionElements}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>);
    }
}

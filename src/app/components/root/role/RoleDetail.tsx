import React from "react";
import { IPermission } from "../../../cmn/models/Permission";
import { IRole } from "../../../cmn/models/Role";
import { IPermissionCollection } from "../../../service/AuthService";
import { ModelService } from "../../../service/ModelService";
import { IPageComponentProps, PageComponent } from "../../PageComponent";

interface IRoleDetailParams {
    id: number;
}

interface IRoleDetailProps extends IPageComponentProps<IRoleDetailParams> {
}

interface IRoleDetailState {
    role: IRole;
}

export class RoleDetail extends PageComponent<IRoleDetailProps, IRoleDetailState> {
    private service = ModelService.getService<IRole>("role", "acl/role");

    constructor(props: IRoleDetailProps) {
        super(props);
        this.state = { role: null };
    }

    public componentDidMount() {
        this.service.fetch(+this.props.match.params.id)
            .then((role) => this.setState({ role }));
    }

    public render() {
        const role = this.state.role;
        if (!role) { return null; }
        const permissions: IPermissionCollection = {};
        for (let i = 0, il = role.permissions.length; i < il; ++i) {
            const p: IPermission = role.permissions[i] as IPermission;
            if (!permissions[p.resource]) {
                permissions[p.resource] = [];
            }
            permissions[p.resource].push(p.action);
        }
        const permissionElements = [];
        for (let resources = Object.keys(permissions), i = 0, il = resources.length; i < il; ++i) {
            permissionElements.push(
                <tr key={i}>
                    <td>{resources[i]}</td>
                    <td>{permissions[resources[i]].join(", ")}</td>
                </tr>);
        }
        const statusOptions = { 1: this.tr("enum_active"), 0: this.tr("enum_inactive") };
        return (
            <div className="crud-page">
                <table className="details-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>{this.tr("mdl_role")} #{role.id}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.tr("fld_name")}</td>
                            <td>{role.name}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_desc")}</td>
                            <td>{role.desc}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_status")}</td>
                            <td>{statusOptions[role.status]}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_permission")}</td>
                            <td>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{this.tr("fld_resource")}</th>
                                            <th>{this.tr("fld_action")}</th>
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
            </div>
        );
    }
}

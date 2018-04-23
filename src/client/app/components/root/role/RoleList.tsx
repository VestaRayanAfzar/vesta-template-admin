import React from "react";
import { IRole } from "../../../cmn/models/Role";
import { IDeleteResult } from "../../../medium";
import { IAccess } from "../../../service/AuthService";
import { DataTable, IColumn, IDataTableQueryOption } from "../../general/DataTable";
import { DataTableOperations } from "../../general/DataTableOperations";
import { FetchAll, IPageComponentProps, PageComponent } from "../../PageComponent";

interface IRoleListParams {
}

interface IRoleListProps extends IPageComponentProps<IRoleListParams> {
    access: IAccess;
    fetch: FetchAll<IRole>;
    queryOption: IDataTableQueryOption<IRole>;
    roles: IRole[];
}

interface IRoleListState {
}

export class RoleList extends PageComponent<IRoleListProps, IRoleListState> {

    constructor(props: IRoleListProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public del = (id) => {
        this.api.del<IDeleteResult>(`acl/role/${id}`)
            .then((response) => {
                this.notif.success(this.tr("info_delete_record", response.items[0]));
                this.props.fetch(this.props.queryOption);
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
            });
    }

    public render() {
        const access = this.props.access;
        const statusOptions = { 1: this.tr("enum_active"), 0: this.tr("enum_inactive") };
        const columns: Array<IColumn<IRole>> = [
            { name: "id", title: this.tr("fld_id") },
            { name: "name", title: this.tr("fld_name") },
            { name: "status", title: this.tr("fld_status"), render: (r) => this.tr(statusOptions[r.status]) },
            {
                render: (r) => <DataTableOperations access={access} id={r.id} onDelete={this.del} path="role" />,
                title: this.tr("operations"),
            },
        ];
        return <div className="crud-page">
            <DataTable fetch={this.props.fetch} columns={columns} records={this.props.roles} pagination={false} />
        </div>;
    }
}

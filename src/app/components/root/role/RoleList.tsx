import React from "react";
import { IRole } from "../../../cmn/models/Role";
import { IDeleteResult } from "../../../medium";
import { IAccess } from "../../../service/AuthService";
import { ModelService } from "../../../service/ModelService";
import { IBaseComponentProps } from "../../BaseComponent";
import { DataTable, IColumn, IDataTableQueryOption } from "../../general/DataTable";
import { DataTableOperations } from "../../general/DataTableOperations";
import { PageComponent } from "../../PageComponent";

interface IRoleListProps extends IBaseComponentProps {
    access: IAccess;
}

interface IRoleListState {
    roles: IRole[];
    queryOption: IDataTableQueryOption<IRole>;
}

export class RoleList extends PageComponent<IRoleListProps, IRoleListState> {
    private service = ModelService.getService<IRole>("acl/role");

    constructor(props: IRoleListProps) {
        super(props);
        this.state = { roles: [], queryOption: {} };
    }

    public componentDidMount() {
        this.fetchAll(this.state.queryOption);
    }

    public render() {
        const { access } = this.props;
        const { roles } = this.state;
        const statusOptions = { 1: this.tr("enum_active"), 0: this.tr("enum_inactive") };
        const columns: Array<IColumn<IRole>> = [
            { name: "id", title: this.tr("fld_id") },
            { name: "name", title: this.tr("fld_name") },
            { name: "status", title: this.tr("fld_status"), render: (r) => this.tr(statusOptions[r.status]) },
            {
                render: (r) => <DataTableOperations access={access} id={r.id} onDelete={this.onDelete} path="role" />,
                title: this.tr("operations"),
            },
        ];
        return <div className="crud-page">
            <DataTable fetch={this.fetchAll} columns={columns} records={roles} pagination={false} />
        </div>;
    }

    private fetchAll = (queryOption: IDataTableQueryOption<IRole>) => {
        this.service.fetchAll(queryOption)
            .then((result) => this.setState({ roles: result, queryOption }));
    }

    private onDelete = (id) => {
        this.api.del<IDeleteResult>(`acl/role/${id}`)
            .then((response) => {
                this.notif.success(this.tr("info_delete_record", response.items[0]));
                this.fetchAll(this.state.queryOption);
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
            });
    }
}

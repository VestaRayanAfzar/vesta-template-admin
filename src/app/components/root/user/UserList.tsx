import React from "react";
import { IUser } from "../../../cmn/models/User";
import { IAccess } from "../../../service/AuthService";
import { ModelService } from "../../../service/models/ModelService";
import { IBaseComponentProps } from "../../BaseComponent";
import { DataTable, IColumn, IDataTableQueryOption } from "../../general/DataTable";
import { DataTableOperations } from "../../general/DataTableOperations";
import { PageComponent } from "../../PageComponent";

interface IUserListProps extends IBaseComponentProps {
    access: IAccess;
}

interface IUserListState {
    queryOption: IDataTableQueryOption<IUser>;
    users: IUser[];
}

export class UserList extends PageComponent<IUserListProps, IUserListState> {

    private userService = ModelService.getService<IUser>("user");

    constructor(props: IUserListProps) {
        super(props);
        this.state = { queryOption: { limit: 20 }, users: [] };
    }

    public componentDidMount() {
        this.onFetch(null);
    }

    public render() {
        const { access } = this.props;
        const { queryOption, users } = this.state;
        const statusOptions = { 1: this.tr("enum_active"), 0: this.tr("enum_inactive") };
        // prevent deleting user
        delete access.del;
        const columns: Array<IColumn<IUser>> = [
            { name: "id", title: this.tr("fld_id") },
            { name: "username", title: this.tr("fld_username") },
            { name: "name", title: this.tr("fld_name") },
            { name: "email", title: this.tr("fld_email") },
            { name: "mobile", title: this.tr("fld_mobile") },
            { name: "status", title: this.tr("fld_status"), render: (r) => this.tr(statusOptions[r.status]) },
            {
                render: (r) => <DataTableOperations access={access} id={r.id} path="user" onDelete={this.onDelete} />,
                title: this.tr("operations"),
            },
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={queryOption} columns={columns} records={users}
                    fetch={this.onFetch} pagination={true} />
            </div>
        );
    }

    private onDelete = (id: number) => {
        this.userService.remove(id)
            .then((isDeleted) => isDeleted ? this.onFetch(null) : null);
    }

    private onFetch = (queryOption: IDataTableQueryOption<IUser>) => {
        if (!queryOption) {
            queryOption = this.state.queryOption;
        }
        this.userService.fetchAll(queryOption)
            .then((users) => this.setState({ users }));
    }
}

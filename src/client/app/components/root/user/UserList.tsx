import React from "react";
import { IUser } from "../../../cmn/models/User";
import { IDeleteResult } from "../../../medium";
import { IAccess } from "../../../service/AuthService";
import { DataTable, IColumn, IDataTableQueryOption } from "../../general/DataTable";
import { DataTableOperations } from "../../general/DataTableOperations";
import { IPageComponentProps, PageComponent } from "../../PageComponent";

interface IUserListParams {
}

interface IUserListProps extends IPageComponentProps<IUserListParams> {
    access: IAccess;
    fetch: (queryOption: IDataTableQueryOption<IUser>) => void;
    queryOption: IDataTableQueryOption<IUser>;
    users: IUser[];
}

interface IUserListState {
    users: IUser[];
}

export class UserList extends PageComponent<IUserListProps, IUserListState> {

    constructor(props: IUserListProps) {
        super(props);
        this.state = { users: [] };
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public del = (id) => {
        this.api.del<IDeleteResult>(`user/${id}`)
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
        const userTypeOptions = {
            0: this.tr("enum_staff"),
            1: this.tr("enum_mechanic"),
            2: this.tr("enum_technician"),
            3: this.tr("enum_user"),
        };
        const userGenderOptions = { 1: this.tr("enum_male"), 2: this.tr("enum_female") };
        const statusOptions = { 1: this.tr("enum_active"), 0: this.tr("enum_inactive") };
        // prevent deleting user
        delete access.del;
        const columns: Array<IColumn<IUser>> = [
            { name: "id", title: this.tr("fld_id") },
            { name: "username", title: this.tr("fld_username") },
            { name: "name", title: this.tr("fld_name") },
            // {name: 'email', title: this.tr('fld_email')},
            { name: "mobile", title: this.tr("fld_mobile") },
            // {name: 'birthDate', title: this.tr('fld_birthDate')},
            // {name: 'gender', title: this.tr('fld_gender'), render: r => this.tr(userGenderOptions[r.gender])},
            { name: "status", title: this.tr("fld_status"), render: (r) => this.tr(statusOptions[r.status]) },
            {
                render: (r) => <DataTableOperations access={access} id={r.id} onDelete={this.del} path="user" />,
                title: this.tr("operations"),
            },
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={this.props.users}
                    fetch={this.props.fetch} pagination={true} />
            </div>
        );
    }
}

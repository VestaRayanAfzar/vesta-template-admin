import { Culture } from "@vesta/core";
import React, { useState } from "react";
import { IUser } from "../../../cmn/models/User";
import { IAccess } from "../../../service/AuthService";
import { ModelService } from "../../../service/ModelService";
import { IBaseComponentProps } from "../../BaseComponent";
import { DataTable, IColumn, IDataTableQueryOption } from "../../general/DataTable";
import { DataTableOperations } from "../../general/DataTableOperations";

interface IUserListProps extends IBaseComponentProps {
    access: IAccess;
}

interface IUserListState {
    queryOption: IDataTableQueryOption<IUser>;
    users: IUser[];
}

export function UserList(props: IUserListProps) {
    const tr = Culture.getDictionary().translate;
    const service = ModelService.getService<IUser>("user");
    const [users, setUsers] = useState([]);
    const queryOption = { limit: 20 };
    const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
    const columns: Array<IColumn<IUser>> = [
        { name: "id", title: tr("fld_id") },
        { name: "username", title: tr("fld_username") },
        { name: "name", title: tr("fld_name") },
        { name: "email", title: tr("fld_email") },
        { name: "mobile", title: tr("fld_mobile") },
        { name: "status", title: tr("fld_status"), render: (r) => tr(statusOptions[r.status]) },
        {
            render: (r) => <DataTableOperations access={access} id={r.id} path="user" onDelete={onDelete} />,
            title: tr("operations"),
        },
    ];

    // prevent deleting user
    const access = { ...props.access };
    delete access.del;

    return (
        <div className="crud-page">
            <DataTable queryOption={queryOption} columns={columns} records={users}
                fetch={onFetch} pagination={true} />
        </div>
    );

    function onDelete(id: number) {
        service.remove(id)
            .then((isDeleted) => isDeleted ? onFetch(null) : null);
    }

    function onFetch(qOptions: IDataTableQueryOption<IUser>) {
        if (!qOptions) {
            qOptions = queryOption;
        }
        service.fetchAll(qOptions).then(setUsers);
    }
}

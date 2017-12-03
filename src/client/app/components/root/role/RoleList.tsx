import React from "react";
import {Link} from "react-router-dom";
import {FetchAll, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IRole} from "../../../cmn/models/Role";
import {Column, DataTable, IDataTableQueryOption} from "../../general/DataTable";
import {IAccess} from "../../../service/AuthService";
import {IDeleteResult} from "../../../cmn/core/ICRUDResult";
import {DataTableOperations} from "../../general/DataTableOperations";

export interface RoleListParams {
}

export interface RoleListProps extends PageComponentProps<RoleListParams> {
    roles: Array<IRole>;
    access: IAccess;
    fetch: FetchAll<IRole>;
    queryOption: IDataTableQueryOption<IRole>;
}

export interface RoleListState extends PageComponentState {
}

export class RoleList extends PageComponent<RoleListProps, RoleListState> {

    constructor(props: RoleListProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public del = (e) => {
        e.preventDefault();
        let match = e.target.href.match(/(\d+)$/);
        if (match) {
            this.api.del<IDeleteResult>('acl/role', +match[0])
                .then(response => {
                    this.notif.success(this.tr('info_delete_record', response.items[0]));
                    this.props.fetch(this.props.queryOption);
                })
                .catch(error => {
                    this.notif.error(this.tr(error.message));
                })
        }
    }

    public render() {
        const access = this.props.access;
        const statusOptions = {1: this.tr('enum_active'), 0: this.tr('enum_inactive')};
        const columns: Array<Column<IRole>> = [
            {name: 'id', title: this.tr('fld_id')},
            {name: 'name', title: this.tr('fld_name')},
            {name: 'status', title: this.tr('fld_status'), render: r => this.tr(statusOptions[r.status])},
            {
                title: this.tr('operations'),
                render: r => <DataTableOperations access={access} id={r.id} onDelete={this.del} path="role"/>
            }
        ];
        return <div className="crud-page">
            <DataTable fetch={this.props.fetch} columns={columns} records={this.props.roles} pagination={false}/>
        </div>
    }
}

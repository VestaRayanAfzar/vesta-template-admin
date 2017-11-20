import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IUser} from "../../../cmn/models/User";
import {Column, DataTable, IDataTableQueryOption} from "../../general/DataTable";
import {IAccess} from "../../../service/AuthService";
import {IDeleteResult} from "../../../cmn/core/ICRUDResult";

export interface UserListParams {
}

export interface UserListProps extends PageComponentProps<UserListParams> {
    users: Array<IUser>;
    access: IAccess;
    fetch: (queryOption: IDataTableQueryOption<IUser>) => void;
    queryOption: IDataTableQueryOption<IUser>;
}

export interface UserListState extends PageComponentState {
    users: Array<IUser>;
}

export class UserList extends PageComponent<UserListProps, UserListState> {

    constructor(props: UserListProps) {
        super(props);
        this.state = {users: []};
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public del = (e) => {
        e.preventDefault();
        let match = e.target.href.match(/(\d+)$/);
        if (!match) return;
        this.api.del<IDeleteResult>('user', +match[0])
            .then(response => {
                this.notif.success(this.tr('info_delete_record', response.items[0]));
                this.props.fetch(this.props.queryOption);
            })
            .catch(error => {
                this.notif.error(this.tr(error.message));
            })
    }

    public render() {
        const access = this.props.access;
        const userTypeOptions = {
            0: this.tr('enum_staff'),
            1: this.tr('enum_mechanic'),
            2: this.tr('enum_technician'),
            3: this.tr('enum_user')
        };
        const userGenderOptions = {1: this.tr('enum_male'), 2: this.tr('enum_female')};
        const statusOptions = {1: this.tr('enum_active'), 0: this.tr('enum_inactive')};
        const columns: Array<Column<IUser>> = [
            {name: 'id', title: this.tr('fld_id')},
            {name: 'username', title: this.tr('fld_username')},
            {name: 'name', title: this.tr('fld_name')},
            // {name: 'email', title: this.tr('fld_email')},
            {name: 'mobile', title: this.tr('fld_mobile')},
            // {name: 'birthDate', title: this.tr('fld_birthDate')},
            // {name: 'gender', title: this.tr('fld_gender'), render: r => this.tr(userGenderOptions[r.gender])},
            {name: 'status', title: this.tr('fld_status'), render: r => this.tr(statusOptions[r.status])},
            {
                title: this.tr('operations'), render: r => <span className="dt-operation-cell">
                <Link to={`/user/detail/${r.id}`}>View</Link>
                {access.edit ? <Link to={`/user/edit/${r.id}`}>Edit</Link> : null}
                {access.del ? <Link to={`/user/del/${r.id}`} onClick={this.del}>Del</Link> : null}</span>
            }
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={this.props.users}
                           fetch={this.props.fetch} pagination={true}/>
            </div>
        )
    }
}

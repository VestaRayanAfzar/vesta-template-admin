import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IRole} from "../../../cmn/models/Role";
import {Column, DataTable, DataTableOption} from "../../general/DataTable";
import {IDeleteResult} from "../../../medium";
import {AuthService} from "../../../service/AuthService";
import {AclAction} from "../../../cmn/enum/Acl";

export interface RoleListParams {
}

export interface RoleListProps extends PageComponentProps<RoleListParams> {
    fetch: () => Promise<Array<IRole>>;
}

export interface RoleListState extends PageComponentState {
    roles: Array<IRole>;
}

export class RoleList extends PageComponent<RoleListProps, RoleListState> {
    private delAccess = false;

    constructor(props: RoleListProps) {
        super(props);
        this.state = {roles: []};
        this.delAccess = AuthService.getInstance().isAllowed('role', AclAction.Delete);
    }

    public componentDidMount() {
        this.props.fetch()
            .then(roles => this.setState({roles}));
    }

    public del = (e) => {
        e.preventDefault();
        let match = e.target.href.match(/(\d+)$/);
        if (match) {
            this.api.del<IDeleteResult>('acl/role', +match[0])
                .then(response => {
                    this.notif.success(this.tr.translate('info_delete_record', response.items[0]));
                    this.props.fetch().then(roles => this.setState({roles}))
                })
        }
    }

    public render() {
        const tr = this.tr.translate;
        const statusOptions = {1: tr('enum_active'), 0: tr('enum_inactive')};
        const dtOptions: DataTableOption<IRole> = {
            showIndex: true
        };
        const columns: Array<Column<IRole>> = [
            {name: 'id', title: tr('fld_id')},
            {name: 'name', title: tr('fld_name')},
            {name: 'status', title: tr('fld_status'), render: r => tr(`enum_${statusOptions[r.status]}`)},
            {
                title: 'Operations', render: r => <span className="dt-operation-cell">
                <Link to={`/role/detail/${r.id}`}>View</Link>
                <Link to={`/role/edit/${r.id}`}>Edit</Link>
                {this.delAccess ? <Link to={`/role/del/${r.id}`} onClick={this.del}>Del</Link> : null}</span>
            }
        ];
        return <div className="page commandList-component">
            <DataTable option={dtOptions} columns={columns} records={this.state.roles}/>
        </div>
    }
}

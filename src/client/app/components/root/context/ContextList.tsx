import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IContext} from "../../../cmn/models/Context";
import {Column, DataTable, IDataTableQueryOption} from "../../general/DataTable";
import {IAccess} from "../../../service/AuthService";
import {IDeleteResult} from "../../../cmn/core/ICRUDResult";

export interface ContextListParams {
}

export interface ContextListProps extends PageComponentProps<ContextListParams> {
    contexts: Array<IContext>;
    access: IAccess;
    fetch: (queryOption: IDataTableQueryOption<IContext>) => void;
    queryOption: IDataTableQueryOption<IContext>;
}

export interface ContextListState extends PageComponentState {
    contexts: Array<IContext>;
}

export class ContextList extends PageComponent<ContextListProps, ContextListState> {

    constructor(props: ContextListProps) {
        super(props);
        this.state = {contexts: []};
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public del = (e) => {
        e.preventDefault();
        let match = e.target.href.match(/(\d+)$/);
        if (!match) return;
        this.api.del<IDeleteResult>('context', +match[0])
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
        const columns: Array<Column<IContext>> = [
			{name: 'id', title: this.tr('fld_id')},
			{name: 'key', title: this.tr('fld_key')},
            {
                title: this.tr('Operations'), render: r => <span className="dt-operation-cell">
                <Link to={`/context/detail/${r.id}`}>View</Link>
                {access.edit ? <Link to={`/context/edit/${r.id}`}>Edit</Link> : null}
                {access.del ? <Link to={`/context/del/${r.id}`} onClick={this.del}>Del</Link> : null}</span>
            }
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={this.props.contexts}
                           fetch={this.props.fetch} pagination={true}/>
            </div>
        )
    }
}

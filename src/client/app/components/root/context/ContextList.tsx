import React from "react";
import {Link} from "react-router-dom";
import {IContext} from "../../../cmn/models/Context";
import { IDeleteResult } from "../../../medium";
import {IAccess} from "../../../service/AuthService";
import {DataTable, IColumn, IDataTableQueryOption} from "../../general/DataTable";
import {DataTableOperations} from "../../general/DataTableOperations";
import {IPageComponentProps, PageComponent} from "../../PageComponent";

export interface IContextListParams {
}

export interface IContextListProps extends IPageComponentProps<IContextListParams> {
    access: IAccess;
    contexts: Array<IContext>;
    fetch: (queryOption: IDataTableQueryOption<IContext>) => void;
    queryOption: IDataTableQueryOption<IContext>;
}

export interface IContextListState {
    contexts: Array<IContext>;
}

export class ContextList extends PageComponent<IContextListProps, IContextListState> {

    constructor(props: IContextListProps) {
        super(props);
        this.state = {contexts: []};
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public render() {
        const access = this.props.access;
        const columns: Array<IColumn<IContext>> = [
            {name: "id", title: this.tr("fld_id")},
            {name: "key", title: this.tr("fld_key")},
            {
                render: (r) => <DataTableOperations access={access} id={r.id} onDelete={this.onDelete} path="context"/>,
                title: this.tr("operations"),
            },
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={this.props.contexts}
                           fetch={this.props.fetch} pagination={true}/>
            </div>
        );
    }

    private onDelete = (id) => {
        this.api.del<IDeleteResult>(`context/${id}`)
            .then((response) => {
                this.notif.success(this.tr("info_delete_record", response.items[0]));
                this.props.fetch(this.props.queryOption);
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
            });
    }
}

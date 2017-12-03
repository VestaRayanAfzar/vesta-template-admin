import React, {Component} from "react";
import {BaseComponentProps} from "../BaseComponent";
import Pagination from "./Pagination";
import {IQueryRequest} from "../../cmn/core/ICRUDResult";
import {shallowClone} from "../../util/Util";

export interface Column<T> {
    name?: string;
    title?: string;
    render?: (record: T) => any;
}

export interface IDataTableQueryOption<T> extends IQueryRequest<T> {
    total?: number;
}

export interface DataTableProps<T> extends BaseComponentProps {
    showIndex?: boolean;
    selectable?: boolean;
    pagination?: boolean;
    fetch?: (option: IDataTableQueryOption<T>) => void;
    queryOption?: IDataTableQueryOption<T>;
    columns: Array<Column<T>>;
    records: Array<T>;
}

export interface DataTableState {
}

export class DataTable<T> extends Component<DataTableProps<T>, DataTableState> {
    private headerRow;

    constructor(props: DataTableProps<T>) {
        super(props);
        this.state = {records: []};
    }

    public componentWillMount() {
        this.createHeader();
    }

    private createHeader() {
        const headerCells = this.props.columns.map((col, i) => {
            return <th key={i + 1}>{col.title || col.name}</th>
        });
        this.headerRow = <tr>{headerCells}</tr>;
    }

    private createRows() {
        let rows = this.props.records || [];
        return rows.map((r, i) => {
            const cells = this.props.columns.map((c, j) => (<td key={j + 1}>{c.render ? c.render(r) : r[c.name]}</td>));
            return <tr key={i + 1}>{cells}</tr>;
        });
    }

    private onPaginationChange = (page: number, recordsPerPage: number) => {
        let queryOption = shallowClone<IQueryRequest<T>>(this.props.queryOption);
        queryOption.page = +page;
        queryOption.limit = recordsPerPage;
        this.props.fetch(queryOption);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // todo
        return true;
    }

    public render() {
        const rows = this.createRows();
        const queryOption = this.props.queryOption;
        const pagination = this.props.pagination ?
            <Pagination totalRecords={queryOption.total} currentPage={queryOption.page}
                        fetch={this.onPaginationChange} recordsPerPage={queryOption.limit}/> : null;
        return (
            <div>
                <div className="dataTable-component">
                    <table>
                        <thead>{this.headerRow}</thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
                {pagination}
            </div>
        )
    }
}

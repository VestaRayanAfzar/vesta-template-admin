import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";

export interface Column<T> {
    name?: string;
    title?: string;
    render?: (record: T) => any;
}

export interface DataTableOption<T> {
    showIndex?: boolean;
    selectable?: boolean;
}

export interface DataTableParams {
}

export interface DataTableProps<T> extends PageComponentProps<DataTableParams> {
    option?: DataTableOption<T>;
    columns: Array<Column<T>>;
    records: Array<T>;
}

export interface DataTableState extends PageComponentState {

}

export class DataTable<T> extends PageComponent<DataTableProps<T>, DataTableState> {
    private headerRow;

    constructor(props: DataTableProps<T>) {
        super(props);
        this.state = {records: []};
    }

    private createHeader() {
        const headerCells = this.props.columns.map((col, i) => {
            return <th key={i + 1}>{col.title || col.name}</th>
        });
        this.headerRow = <tr>{headerCells}</tr>;
    }

    private createRows() {
        return this.props.records.map((r, i) => {
            const cells = this.props.columns.map((c, j) => (<td key={j + 1}>{c.render ? c.render(r) : r[c.name]}</td>));
            return <tr key={i + 1}>{cells}</tr>;
        });
    }

    public componentWillMount() {
        this.createHeader();
    }

    public render() {
        const rows = this.createRows();
        return (
            <div className="dataTable-component">
                <table>
                    <thead>{this.headerRow}</thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}

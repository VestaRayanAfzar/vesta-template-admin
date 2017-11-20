import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface PaginationProps extends BaseComponentProps {
    recordsPerPage: number;
    currentPage: number;
    totalRecords?: number;
    fetch: (page: number, recordsPerPage: number) => void;
}

export interface PaginationState {
    page: number;
}

export default class Pagination extends PureComponent<PaginationProps, PaginationState> {

    constructor(props: PaginationProps) {
        super(props);
        this.state = {page: 1};
    }

    private onChange = (e) => {
        let page = +e.target.value;
        let totalPages = this.totalPages(this.props.totalRecords, this.props.recordsPerPage);

        if(page > totalPages) {
            page = totalPages;
        } else if(page < 1) {
            page = 1;
        }

        if (!isNaN(page)) {
            this.setState({page: page});
        }
    }

    private gotoPage = (e) => {
        this.setState({page: e.target.value});
        this.props.fetch(e.target.value, this.props.recordsPerPage);
    }

    private onSubmit = (e) => {
        e.preventDefault();
        this.props.fetch(this.state.page, this.props.recordsPerPage);
    }

    private totalPages(totalRecords: number, recordsPerPage: number) {
        return Math.ceil(totalRecords / recordsPerPage);
    }

    public render() {
        let {recordsPerPage, totalRecords, currentPage} = this.props;
        totalRecords = totalRecords || 0;
        currentPage = currentPage || 1;
        let key = 1;
        let totalPages = this.totalPages(totalRecords, recordsPerPage);
        if (totalPages <= 1) return null;
        return (
            <div className="pagination btn-group">
                <button className="btn" onClick={this.gotoPage} value={1} key={key++}
                        disabled={currentPage == 1}>&lt;&lt;</button>
                <button className="btn" onClick={this.gotoPage} value={currentPage - 1} key={key++}
                        disabled={currentPage == 1}>&lt;</button>
                <form onSubmit={this.onSubmit}>
                    <input className="btn" type="number" value={this.state.page} key={key++} onChange={this.onChange}/>
                </form>
                <button className="btn" onClick={this.gotoPage} value={currentPage + 1} key={key++}
                        disabled={currentPage == totalPages}>&gt;</button>
                <button className="btn" onClick={this.gotoPage} value={totalPages} key={key}
                        disabled={currentPage == totalPages}>&gt;&gt;</button>
            </div>
        );
    }
}

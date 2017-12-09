import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IContact} from "../../../cmn/models/Contact";
import {Column, DataTable, IDataTableQueryOption} from "../../general/DataTable";
import {IDeleteResult} from "../../../cmn/core/ICRUDResult";
import {IAccess} from "../../../service/AuthService";
import {DataTableOperations} from "../../general/DataTableOperations";
import {Culture} from "../../../cmn/core/Culture";

export interface ContactListParams {
}

export interface ContactListProps extends PageComponentProps<ContactListParams> {
    contacts: Array<IContact>;
    access: IAccess;
    fetch: (queryOption: IDataTableQueryOption<IContact>) => void;
    queryOption: IDataTableQueryOption<IContact>;
}

export interface ContactListState extends PageComponentState {
    contacts: Array<IContact>;
}

export class ContactList extends PageComponent<ContactListProps, ContactListState> {

    constructor(props: ContactListProps) {
        super(props);
        this.state = {contacts: []};
    }

    public componentDidMount() {
        this.props.fetch(this.props.queryOption);
    }

    public del = (e) => {
        e.preventDefault();
        let match = e.target.href.match(/(\d+)$/);
        if (!match) return;
        this.api.del<IDeleteResult>('contact', +match[0])
            .then(response => {
                this.notif.success(this.tr('info_delete_record', response.items[0]));
                this.props.fetch(this.props.queryOption);
            })
            .catch(error => {
                this.notif.error(error.message);
            })
    }

    public render() {
        const {access} = this.props;
		const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormat = Culture.getLocale().defaultDateFormat;
        const columns: Array<Column<IContact>> = [
			{name: 'id', title: this.tr('fld_id')},
			{name: 'title', title: this.tr('fld_title')},

                {
                    title: this.tr('fld_date'),
                    render: r => {
                        {
                dateTime.setTime(r.date);
                return dateTime.format(dateTimeFormat);
            }
                    }
                },
			{name: 'name', title: this.tr('fld_name')},
            {
                title: this.tr('operations'),
                render: r => <DataTableOperations access={access} id={r.id} onDelete={this.del} path="contact"/>
            }
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={this.props.contacts}
                           fetch={this.props.fetch} pagination={true}/>
            </div>
        )
    }
}

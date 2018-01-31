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
    onFetch: (queryOption: IDataTableQueryOption<IContact>) => void;
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
        this.props.onFetch(this.props.queryOption);
    }

    public onDelete = (id) => {
        this.api.del<IDeleteResult>('contact', id)
            .then(response => {
                this.notif.success(this.tr('info_delete_record', response.items[0]));
                this.props.onFetch(this.props.queryOption);
            })
            .catch(error => {
                this.notif.error(error.message);
            })
    }

    public render() {
        const {access, onFetch, contacts} = this.props;
        delete access.edit;
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormat = Culture.getLocale().defaultDateFormat;
        const columns: Array<Column<IContact>> = [
            {name: 'id', title: this.tr('fld_id')},
            {name: 'title', title: this.tr('fld_title')},
            {
                title: this.tr('fld_date'),
                render: r => {
                    dateTime.setTime(r.date);
                    return dateTime.format(dateTimeFormat);
                }
            },
            {name: 'name', title: this.tr('fld_name')},
            {name: 'phone', title: this.tr('fld_phone')},
            {
                title: this.tr('operations'),
                render: r => <DataTableOperations access={access} id={r.id} onDelete={this.onDelete} path="contact"/>
            }
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={contacts}
                           fetch={onFetch} pagination={true}/>
            </div>
        )
    }
}

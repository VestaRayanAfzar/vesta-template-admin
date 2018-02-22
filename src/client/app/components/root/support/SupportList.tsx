import React from "react";
import { Link } from "react-router-dom";
import { ISupport } from "../../../cmn/models/Support";
import { Culture, IDeleteResult } from "../../../medium";
import { IAccess } from "../../../service/AuthService";
import { DataTable, IColumn, IDataTableQueryOption } from "../../general/DataTable";
import { DataTableOperations } from "../../general/DataTableOperations";
import { IPageComponentProps, PageComponent } from "../../PageComponent";

export interface ISupportListParams {
}

export interface ISupportListProps extends IPageComponentProps<ISupportListParams> {
    access: IAccess;
    contacts: Array<ISupport>;
    onFetch: (queryOption: IDataTableQueryOption<ISupport>) => void;
    queryOption: IDataTableQueryOption<ISupport>;
}

export interface ISupportListState {
    contacts: Array<ISupport>;
}

export class SupportList extends PageComponent<ISupportListProps, ISupportListState> {

    constructor(props: ISupportListProps) {
        super(props);
        this.state = { contacts: [] };
    }

    public componentDidMount() {
        this.props.onFetch(this.props.queryOption);
    }

    public render() {
        const { access, onFetch, contacts } = this.props;
        delete access.edit;
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormat = Culture.getLocale().defaultDateFormat;
        const columns: Array<IColumn<ISupport>> = [
            { name: "id", title: this.tr("fld_id") },
            { name: "title", title: this.tr("fld_title") },
            {
                render: (r) => {
                    dateTime.setTime(r.date);
                    return dateTime.format(dateTimeFormat);
                },
                title: this.tr("fld_date"),
            },
            { name: "name", title: this.tr("fld_name") },
            { name: "phone", title: this.tr("fld_phone") },
            {
                render: (r) => <DataTableOperations access={access} id={r.id} onDelete={this.onDelete} path="contact" />,
                title: this.tr("operations"),
            },
        ];
        return (
            <div className="crud-page">
                <DataTable queryOption={this.props.queryOption} columns={columns} records={contacts}
                    fetch={onFetch} pagination={true} />
            </div>
        );
    }

    private onDelete = (id) => {
        this.api.del<IDeleteResult>(`contact/${id}`)
            .then((response) => {
                this.notif.success(this.tr("info_delete_record", response.items[0]));
                this.props.onFetch(this.props.queryOption);
            })
            .catch((error) => {
                this.notif.error(error.message);
            });
    }
}

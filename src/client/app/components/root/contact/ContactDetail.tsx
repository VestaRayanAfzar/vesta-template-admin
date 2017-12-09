import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IContact} from "../../../cmn/models/Contact";

export interface ContactDetailParams {
    id: number;
}

export interface ContactDetailProps extends PageComponentProps<ContactDetailParams> {
    fetch: FetchById<IContact>;
}

export interface ContactDetailState extends PageComponentState {
    contact: IContact;
}

export class ContactDetail extends PageComponent<ContactDetailProps, ContactDetailState> {

    constructor(props: ContactDetailProps) {
        super(props);
        this.state = {contact: {}};
    }

    public componentDidMount() {
        this.props.fetch(+this.props.match.params.id)
            .then(contact => this.setState({contact}));
    }

    public render() {
        const contact = this.state.contact;
        if (!contact) return null;
        return (
            <div className="crud-page">
                <table className="details-table">
                    <thead>
                    <tr>
                        <th colSpan={2}>{this.tr('title_record_detail', this.tr('mdl_contact'), contact.id)}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
						<td>{this.tr('fld_title')}</td>
						<td>{contact.title}</td>
					</tr>
					<tr>
						<td>{this.tr('fld_content')}</td>
						<td>{contact.content}</td>
					</tr>
					<tr>
						<td>{this.tr('fld_name')}</td>
						<td>{contact.name}</td>
					</tr>
					<tr>
						<td>{this.tr('fld_phone')}</td>
						<td>{contact.phone}</td>
					</tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

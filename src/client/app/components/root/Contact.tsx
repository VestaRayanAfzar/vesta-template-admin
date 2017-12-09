import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {Route, Switch} from "react-router";
import {IValidationError} from "../../cmn/core/Validator";
import {DynamicRouter} from "../general/DynamicRouter";
import {IDataTableQueryOption} from "../general/DataTable";
import {PageTitle} from "../general/PageTitle";
import {Preloader} from "../general/Preloader";
import {CrudMenu} from "../general/CrudMenu";
import {IAccess} from "../../service/AuthService";
import {IContact} from "../../cmn/models/Contact";
import {ContactDetail} from "./contact/ContactDetail";
import {ContactList} from "./contact/ContactList";

export interface ContactParams {
}

export interface ContactProps extends PageComponentProps<ContactParams> {
}

export interface ContactState extends PageComponentState {
    showLoader: boolean;
    validationErrors: IValidationError;
    contacts: Array<IContact>;
    queryOption: IDataTableQueryOption<IContact>;
}

export class Contact extends PageComponent<ContactProps, ContactState> {
    private access: IAccess;

    constructor(props: ContactProps) {
        super(props);
        this.access = this.auth.getAccessList('contact');
        this.state = {
            showLoader: false,
            validationErrors: null,
            contacts: [],
            queryOption: {page: 1, limit: this.pagination.itemsPerPage}
        };
    }

    public fetch = (id: number) => {
        this.setState({showLoader: true});
        return this.api.get<IContact>(`contact/${id}`)
            .then(response => {
                this.setState({showLoader: false});
                return response.items[0];
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(error.message);
            })
    }

    private fetchCount = (queryOption: IDataTableQueryOption<IContact>) => {
        this.api.get<IContact>('contact/count', queryOption)
            .then(response => {
                this.state.queryOption.total = response.total;
                this.setState({queryOption: this.state.queryOption});
            })
            .catch(error => {
                this.state.queryOption.total = 0;
                this.setState({queryOption: this.state.queryOption});
                this.notif.error(error.message);
            })
    }

    public fetchAll = (queryOption: IDataTableQueryOption<IContact>) => {
        this.setState({showLoader: true, queryOption});
        this.fetchCount(queryOption);
        this.api.get<IContact>('contact', queryOption)
            .then(response => {
                this.setState({showLoader: false, contacts: response.items});
            })
            .catch(error => {
                this.setState({showLoader: false, validationErrors: error.violations});
                this.notif.error(error.message);
            })
    }

    public render() {
        let {showLoader, contacts, queryOption} = this.state;
        delete this.access.add;
        delete this.access.edit;

        return (
            <div className="page contact-page has-navbar">
                <PageTitle title={this.tr('mdl_contact')}/>
                <Navbar title={this.tr('mdl_contact')} showBurger={true}/>
                <h1>{this.tr('mdl_contact')}</h1>
                <Preloader show={showLoader}/>
                <CrudMenu path="contact" access={this.access}/>
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            <Route path="/contact/detail/:id"
                                   render={this.tz(ContactDetail, {contact: ['read']}, {
                                       fetch: this.fetch
                                   })}/>
                        </Switch>
                    </DynamicRouter>
                    <ContactList access={this.access} fetch={this.fetchAll} queryOption={queryOption}
                                 contacts={contacts}/>
                </div>
            </div>
        )
    }
}

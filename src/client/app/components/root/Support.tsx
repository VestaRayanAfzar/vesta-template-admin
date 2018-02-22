import React from "react";
import { Route, Switch } from "react-router";
import { ISupport, Support as SupportModel } from "../../cmn/models/Support";
import { IValidationError } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import { IDataTableQueryOption } from "../general/DataTable";
import { DynamicRouter } from "../general/DynamicRouter";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";
import { SupportDetail } from "./support/SupportDetail";
import { SupportList } from "./support/SupportList";

export interface ISupportParams {
}

export interface ISupportProps extends IPageComponentProps<ISupportParams> {
}

export interface ISupportState {
    contacts: Array<ISupport>;
    queryOption: IDataTableQueryOption<ISupport>;
    showLoader?: boolean;
    validationErrors?: IValidationError;
}

export class Support extends PageComponent<ISupportProps, ISupportState> {
    private access: IAccess;

    constructor(props: ISupportProps) {
        super(props);
        this.access = this.auth.getAccessList("support");
        this.state = { contacts: [], queryOption: { limit: this.pagination.itemsPerPage, page: 1 } };
    }

    public render() {
        const { showLoader, contacts, queryOption, validationErrors } = this.state;
        delete this.access.add;
        return (
            <div className="page contact-page has-navbar">
                <PageTitle title={this.tr("mdl_support")} />
                <Navbar title={this.tr("mdl_support")} showBurger={true} />
                <h1>{this.tr("mdl_support")}</h1>
                <Preloader show={showLoader} />
                <CrudMenu path="support" access={this.access} />
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            <Route path="/contact/detail/:id" render={this.tz(SupportDetail, { contact: ["read"] }, { onFetch: this.onFetch })} />
                        </Switch>
                    </DynamicRouter>
                    <SupportList access={this.access} onFetch={this.onFetchAll} queryOption={queryOption}
                        contacts={contacts} />
                </div>
            </div>
        );
    }

    private onFetch = (id: number) => {
        this.setState({ showLoader: true });
        return this.api.get<ISupport>(`support/${id}`)
            .then((response) => {
                this.setState({ showLoader: false });
                return response.items[0];
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(error.message);
            });
    }

    private onFetchAll = (queryOption: IDataTableQueryOption<ISupport>) => {
        this.setState({ showLoader: true, queryOption });
        this.onFetchCount(queryOption);
        this.api.get<ISupport>("support", queryOption)
            .then((response) => {
                this.setState({ showLoader: false, contacts: response.items });
            })
            .catch((error) => {
                this.setState({ showLoader: false, validationErrors: error.violations });
                this.notif.error(error.message);
            });
    }

    private onFetchCount = (queryOption: IDataTableQueryOption<ISupport>) => {
        this.api.get<ISupport>("support/count", queryOption)
            .then((response) => {
                this.state.queryOption.total = response.total;
                this.setState({ queryOption: this.state.queryOption });
            })
            .catch((error) => {
                this.state.queryOption.total = 0;
                this.setState({ queryOption: this.state.queryOption });
                this.notif.error(error.message);
            });
    }

    private onSave = (model: ISupport) => {
        const contact = new SupportModel(model);
        const saveType = contact.id ? "update" : "add";
        const validationErrors = contact.validate();
        if (validationErrors) {
            return this.setState({ validationErrors });
        }
        this.setState({ showLoader: true, validationErrors: null });
        const data = contact.getValues<ISupport>();
        (model.id ? this.api.put<ISupport>("support", data) : this.api.post<ISupport>("support", data))
            .then((response) => {
                this.setState({ showLoader: false });
                this.notif.success(this.tr(`info_${saveType}_record`, `${response.items[0].id}`));
                this.onFetchAll(this.state.queryOption);
                this.props.history.goBack();
            })
            .catch((error) => {
                this.setState({ showLoader: false, validationErrors: error.violations });
                this.notif.error(error.message);
            });
    }
}

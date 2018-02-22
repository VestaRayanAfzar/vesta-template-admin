import React from "react";
import { Route, Switch } from "react-router";
import { Context as ContextModel, IContext } from "../../cmn/models/Context";
import { IValidationError } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import { IDataTableQueryOption } from "../general/DataTable";
import { DynamicRouter } from "../general/DynamicRouter";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";
import { ContextAdd } from "./context/ContextAdd";
import { ContextDetail } from "./context/ContextDetail";
import { ContextEdit } from "./context/ContextEdit";
import { ContextList } from "./context/ContextList";

export interface IContextParams {
}

export interface IContextProps extends IPageComponentProps<IContextParams> {
}

export interface IContextState {
    contexts: Array<IContext>;
    queryOption: IDataTableQueryOption<IContext>;
    showLoader?: boolean;
    validationErrors?: IValidationError;
}

export class Context extends PageComponent<IContextProps, IContextState> {
    private access: IAccess;

    constructor(props: IContextProps) {
        super(props);
        this.access = this.auth.getAccessList("context");
        this.state = { contexts: [], queryOption: { page: 1, limit: this.pagination.itemsPerPage } };
    }

    public render() {
        const { showLoader, contexts, queryOption, validationErrors } = this.state;
        return (
            <div className="page context-page has-navbar">
                <PageTitle title={this.tr("mdl_context")} />
                <Navbar title={this.tr("mdl_context")} showBurger={true} />
                <h1>{this.tr("mdl_context")}</h1>
                <Preloader show={showLoader} />
                <CrudMenu path="context" access={this.access} />
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            {this.access.add ?
                                <Route path="/context/add"
                                    render={this.tz(ContextAdd, { context: ["add"] }, {
                                        save: this.save, validationErrors,
                                    })} /> : null}
                            {this.access.edit ?
                                <Route path="/context/edit/:id"
                                    render={this.tz(ContextEdit, { context: ["edit"] }, {
                                        save: this.save, fetch: this.fetch, validationErrors,
                                    })} /> : null}
                            <Route path="/context/detail/:id"
                                render={this.tz(ContextDetail, { context: ["read"] }, {
                                    fetch: this.fetch,
                                })} />
                        </Switch>
                    </DynamicRouter>
                    <ContextList access={this.access} fetch={this.fetchAll} queryOption={queryOption}
                        contexts={contexts} />
                </div>
            </div>
        );
    }

    private fetch = (id: number) => {
        this.setState({ showLoader: true });
        return this.api.get<IContext>(`context/${id}`)
            .then((response) => {
                this.setState({ showLoader: false });
                return response.items[0];
            })
            .catch((error) => {
                this.notif.error(this.tr(error.message));
            });
    }

    private fetchCount = (queryOption: IDataTableQueryOption<IContext>) => {
        this.api.get<IContext>("context/count", queryOption)
            .then((response) => {
                this.state.queryOption.total = response.total;
                this.setState({ queryOption: this.state.queryOption });
            })
            .catch((error) => {
                this.state.queryOption.total = 0;
                this.setState({ queryOption: this.state.queryOption });
                this.notif.error(this.tr(error.message));
            });
    }

    private fetchAll = (queryOption: IDataTableQueryOption<IContext>) => {
        this.setState({ showLoader: true, queryOption });
        this.fetchCount(queryOption);
        this.api.get<IContext>("context", queryOption)
            .then((response) => {
                this.setState({ showLoader: false, contexts: response.items });
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(this.tr(error.message));
            });
    }

    private save = (model: IContext) => {
        const context = new ContextModel(model);
        const saveType = context.id ? "update" : "add";
        const validationResult = context.validate();
        if (validationResult) {
            return this.setState({ validationErrors: validationResult });
        }
        this.setState({ showLoader: true });
        const data = context.getValues<IContext>();
        (model.id ? this.api.put<IContext>("context", data) : this.api.post<IContext>("context", data))
            .then((response) => {
                this.setState({ showLoader: false });
                this.notif.success(this.tr(`info_${saveType}_record`, `${response.items[0].id}`));
                this.fetchAll(this.state.queryOption);
                this.props.history.goBack();
            })
            .catch((error) => {
                this.setState({ showLoader: false, validationErrors: error.validation });
                this.notif.error(this.tr(error.message));
            });
    }
}

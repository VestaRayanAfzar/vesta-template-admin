import React from "react";
import { Route, Switch } from "react-router";
import { ILog } from "../../cmn/models/Log";
import { IUser, SourceApp } from "../../cmn/models/User";
import { Culture } from "../../medium";
import { DynamicRouter } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { CrudMenu } from "../general/CrudMenu";
import { DataTable, IColumn, IDataTableQueryOption } from "../general/DataTable";
import { DataTableOperations } from "../general/DataTableOperations";
import Navbar from "../general/Navbar";
import { PageTitle } from "../general/PageTitle";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";
import { LogDetail } from "./log/LogDetail";

export interface ILogger {
    duration: number;
    level: number;
    logs: ILog[];
    sourceApp: SourceApp;
    start: number;
    user: number | IUser;
}

interface ILogParams {
}

interface ILogProps extends IPageComponentProps<ILogParams> {
}

interface ILogState {
    logs: string[];
    queryOption: IDataTableQueryOption<ILog>;
    showLoader?: boolean;
    users: IUser[];
}

export class Log extends PageComponent<ILogProps, ILogState> {
    private access: IAccess;

    constructor(props: ILogProps) {
        super(props);
        this.access = this.auth.getAccessList("log");
        delete this.access.add;
        delete this.access.edit;
        this.state = { logs: [], queryOption: { page: 1, limit: this.pagination.itemsPerPage }, users: [] };
    }

    public componentDidMount() {
        this.onFetchAll();
    }

    public render() {
        const { showLoader, logs } = this.state;
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormst = Culture.getLocale().defaultDateTimeFormat;
        const columns: Array<IColumn<string>> = [
            { title: this.tr("fld_name"), render: (r) => <p className="en">{r}</p> },
            {
                render: (r) => {
                    const timestamp = +(/^\d+/.exec(r)[0]);
                    dateTime.setTime(timestamp);
                    return <p className="en">{dateTime.format(dateTimeFormst)}</p>;
                },
                title: this.tr("fld_file"),
            },
            {
                render: (r) => {
                    const timestamp = +(/^\d+/.exec(r)[0]);
                    return <DataTableOperations access={this.access} id={timestamp}
                        onDelete={this.onDelete} path="log" />;
                },
                title: this.tr("operations"),
            },
        ];

        return (
            <div className="page log-page has-navbar">
                <PageTitle title={this.tr("mdl_log")} />
                <Navbar title={this.tr("mdl_log")} showBurger={true} />
                <h1>{this.tr("mdl_log")}</h1>
                <Preloader show={showLoader} />
                <CrudMenu path="log" access={this.access} />
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            <Route path="/log/detail/:id" render={this.tz(LogDetail, { log: ["read"] }, { onFetch: this.onFetch })} />
                        </Switch>
                    </DynamicRouter>
                    <div className="crud-page">
                        <DataTable columns={columns} records={logs} />
                    </div>
                </div>
            </div>
        );
    }

    private onFetch = (id: number) => {
        this.setState({ showLoader: true });
        return this.api.get(`log/${id}`)
            .then((response) => {
                this.setState({ showLoader: false });
                return response;
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(error.message);
            });
    }

    private onFetchAll = () => {
        this.setState({ showLoader: true });
        this.api.get<string>("log")
            .then((response) => {
                this.setState({ showLoader: false, logs: response.items });
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                this.notif.error(error.message);
            });
    }

    private onDelete = (id) => {
        this.setState({ showLoader: true });
        this.api.del(`log/${id}`)
            .then((response) => {
                this.setState({ showLoader: false });
                this.onFetchAll();
            })
            .catch((error) => {
                this.setState({ showLoader: false });
            });
    }
}

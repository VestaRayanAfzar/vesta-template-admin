import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {Route, Switch} from "react-router";
import {DynamicRouter} from "../general/DynamicRouter";
import {Column, DataTable, IDataTableQueryOption} from "../general/DataTable";
import {PageTitle} from "../general/PageTitle";
import {Preloader} from "../general/Preloader";
import {IAccess} from "../../service/AuthService";
import {ILog} from "../../cmn/models/Log";
import {LogDetail} from "./log/LogDetail";
import {IUser, SourceApp} from "../../cmn/models/User";
import {Culture} from "../../cmn/core/Culture";
import {DataTableOperations} from "../general/DataTableOperations";
import {CrudMenu} from "../general/CrudMenu";

export interface ILogger {
    start: number;
    duration: number;
    level: number;
    user: number | IUser;
    sourceApp: SourceApp;
    logs: Array<ILog>;
}

export interface LogParams {
}

export interface LogProps extends PageComponentProps<LogParams> {
}

export interface LogState extends PageComponentState {
    showLoader: boolean;
    logs: Array<string>;
    queryOption: IDataTableQueryOption<ILog>;
    users: Array<IUser>;
}

export class Log extends PageComponent<LogProps, LogState> {
    private access: IAccess;

    constructor(props: LogProps) {
        super(props);
        this.access = this.auth.getAccessList('log');
        delete this.access.add;
        delete this.access.edit;
        this.state = {
            showLoader: false,
            logs: [],
            queryOption: {page: 1, limit: this.pagination.itemsPerPage},
            users: []
        };
    }

    public componentDidMount() {
        this.onFetchAll();
    }

    public onFetch = (id: number) => {
        this.setState({showLoader: true});
        return this.api.get(`log/${id}`)
            .then(response => {
                this.setState({showLoader: false});
                return response;
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(error.message);
            })
    }

    public onFetchAll = () => {
        this.setState({showLoader: true});
        this.api.get<string>('log')
            .then(response => {
                this.setState({showLoader: false, logs: response.items});
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(error.message);
            })
    }

    public onDelete = (id) => {
        this.setState({showLoader: true});
        this.api.del('log', id)
            .then(response => {
                this.setState({showLoader: false});
                this.onFetchAll();
            })
            .catch(error => {
                this.setState({showLoader: false});
            })
    }

    public render() {
        let {showLoader, logs} = this.state;
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormst = Culture.getLocale().defaultDateTimeFormat;
        const columns: Array<Column<string>> = [
            {
                title: this.tr('fld_name'), render: r => <p className="en">{r}</p>
            },
            {
                title: 'fld_file', render: r => {
                    let timestamp = +(/^\d+/.exec(r)[0]);
                    dateTime.setTime(timestamp);
                    return <p className="en">{dateTime.format(dateTimeFormst)}</p>;
                }
            },
            {
                title: this.tr('operations'),
                render: r => {
                    let timestamp = +(/^\d+/.exec(r)[0]);
                    return <DataTableOperations access={this.access} id={timestamp} onDelete={this.onDelete}
                                                path="log"/>;
                }
            }
        ];

        return (
            <div className="page log-page has-navbar">
                <PageTitle title={this.tr('mdl_log')}/>
                <Navbar title={this.tr('mdl_log')} showBurger={true}/>
                <h1>{this.tr('mdl_log')}</h1>
                <Preloader show={showLoader}/>
                <CrudMenu path="log" access={this.access}/>
                <div className="crud-wrapper">
                    <DynamicRouter>
                        <Switch>
                            <Route path="/log/detail/:id"
                                   render={this.tz(LogDetail, {log: ['read']}, {
                                       onFetch: this.onFetch
                                   })}/>
                        </Switch>
                    </DynamicRouter>
                    <div className="crud-page">
                        <DataTable columns={columns} records={logs}/>
                    </div>
                </div>
            </div>
        )
    }
}

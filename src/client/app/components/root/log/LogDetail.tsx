import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IUser} from "../../../cmn/models/User";
import {Culture} from "../../../cmn/core/Culture";
import {ILogger} from "../Log";

export interface LogDetailParams {
    id: number;
}

export interface LogDetailProps extends PageComponentProps<LogDetailParams> {
    onFetch: FetchById<string>;
    users: Array<IUser>;
}

export interface LogDetailState extends PageComponentState {
    log: string;
}

export class LogDetail extends PageComponent<LogDetailProps, LogDetailState> {

    constructor(props: LogDetailProps) {
        super(props);
        this.state = {log: ''};
    }

    public componentDidMount() {
        this.props.onFetch(+this.props.match.params.id)
            .then(log => this.setState({log}));
    }

    private renderRecord(log: ILogger, index: number) {
        const logLevelOptions = {
            0: this.tr('enum_none'),
            1: this.tr('enum_error'),
            2: this.tr('enum_warn'),
            3: this.tr('enum_info'),
        };
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormat = Culture.getLocale().defaultDateTimeFormat;
        dateTime.setTime(log.start);
        const logDate = dateTime.format(dateTimeFormat);
        const sourceAppOptions = {1: this.tr('enum_panel'), 2: this.tr('enum_enduser'), 3: this.tr('enum_service')};
        const logs = log.logs.map((log, index) => {
            const messages = log.message.split('-;-').map((msg, index) => (
                <li key={index} className={`alert alert-${log.level}`}>{msg}</li>
            ));

            return (
                <li key={index} className="en">
                    <code>
                        {`@${log.file || ''}::${log.method || ''}`}
                        <ul>
                            {messages}
                        </ul>
                    </code>
                </li>
            )
        });

        return (
            <div className="details-table" key={index}>
                <p><label>{this.tr('fld_level')}</label> {logLevelOptions[log.level]}</p>
                <p><label>{this.tr('fld_date')}</label> <span className="en">{logDate}</span></p>
                <p><label>{this.tr('fld_sourceapp')}</label> {sourceAppOptions[log.sourceApp]}</p>
                <ul>
                    {logs}
                </ul>
            </div>
        )
    }

    public render() {
        const log = this.state.log;
        if (!log) return null;
        const records = [];
        const lines = log.split('\n');
        for (let i = 1, il = lines.length; i < il; ++i) {
            records.push(this.renderRecord(JSON.parse(lines[i]), i));
        }
        return (
            <div className="crud-page">
                {records}
            </div>
        )
    }
}

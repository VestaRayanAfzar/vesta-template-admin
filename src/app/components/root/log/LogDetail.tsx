import { Culture } from "@vesta/core";
import React from "react";
import { ILog } from "../../../cmn/models/Log";
import { IUser } from "../../../cmn/models/User";
import { ModelService } from "../../../service/ModelService";
import { IPageComponentProps, PageComponent } from "../../PageComponent";
import { ILogger } from "../Log";

interface ILogDetailParams {
    id: number;
}

interface ILogDetailProps extends IPageComponentProps<ILogDetailParams> {
    users: IUser[];
}

interface ILogDetailState {
    log: string;
}

export class LogDetail extends PageComponent<ILogDetailProps, ILogDetailState> {
    private service = ModelService.getService<string>("log");

    constructor(props: ILogDetailProps) {
        super(props);
        this.state = { log: "" };
    }

    public componentDidMount() {
        this.service.fetch(+this.props.match.params.id)
            .then((log) => this.setState({ log }));
    }

    public render() {
        const log = this.state.log;
        if (!log) { return null; }
        const records = [];
        const lines = log.split("\n");
        for (let i = 1, il = lines.length; i < il; ++i) {
            records.push(this.renderRecord(JSON.parse(lines[i]), i));
        }
        return (
            <div className="crud-page">
                {records}
            </div>
        );
    }

    private renderRecord(log: ILogger, index: number) {
        const logLevelOptions = {
            0: this.tr("enum_none"),
            1: this.tr("enum_error"),
            2: this.tr("enum_warn"),
            3: this.tr("enum_info"),
        };
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormat = Culture.getLocale().defaultDateTimeFormat;
        dateTime.setTime(log.start);
        const logDate = dateTime.format(dateTimeFormat);
        const sourceAppOptions = { 1: this.tr("enum_panel"), 2: this.tr("enum_enduser"), 3: this.tr("enum_service") };
        const logs = log.logs.map((thisLog, i) => {
            const messages = thisLog.message.split("-;-").map((msg, j) => (
                <li key={j} className={`alert alert-${thisLog.level}`}>{msg}</li>
            ));

            return (
                <li key={i} className="en">
                    <code>
                        {`@${thisLog.file || ""}::${thisLog.method || ""}`}
                        <ul>
                            {messages}
                        </ul>
                    </code>
                </li>
            );
        });

        return (
            <div className="details-table" key={index}>
                <p><label>{this.tr("fld_level")}</label> {logLevelOptions[log.level]}</p>
                <p><label>{this.tr("fld_date")}</label> <span className="en">{logDate}</span></p>
                <p><label>{this.tr("fld_sourceapp")}</label> {sourceAppOptions[log.sourceApp]}</p>
                <ul>
                    {logs}
                </ul>
            </div>
        );
    }
}

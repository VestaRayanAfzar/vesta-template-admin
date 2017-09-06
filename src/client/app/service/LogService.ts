import {ConfigService} from "./ConfigService";

export class LogService {
    private static LogType = {Log: 'log', Info: 'info', Warn: 'warn', Error: 'error'};
    private static instance: LogService = null;
    private isProduction = true;


    constructor() {
        LogService.instance = this;
        this.isProduction = ConfigService.getConfig().env === 'production';
    }

    private echo(logType: string, location: string, log: any) {
        if (this.isProduction) {
            // todo what to do ???
        } else {
            console[logType](location, log);
        }
    }

    public log(location: string, log: any) {
        this.echo(LogService.LogType.Log, location, log);
    }

    public warn(location: string, warning: any) {
        this.echo(LogService.LogType.Warn, location, warning);
    }

    public info(location: string, information: any) {
        this.echo(LogService.LogType.Info, location, information);
    }

    public error(location: string, error: any) {
        this.echo(LogService.LogType.Error, location, error);
    }

    public static getInstance(): LogService {
        if (!LogService.instance) {
            LogService.instance = new LogService();
        }
        return LogService.instance;
    }
}
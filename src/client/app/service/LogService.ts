export class LogService {
    private static LogType = {Log: 'log', Info: 'info', Warn: 'warn', Error: 'error'};

    public static log(log: any, method?: string, file?: string) {
        LogService.echo(LogService.LogType.Log, method, file, log);
    }

    public static warn(warning: any, method?: string, file?: string) {
        LogService.echo(LogService.LogType.Warn, method, file, warning);
    }

    public static info(information: any, method?: string, file?: string) {
        LogService.echo(LogService.LogType.Info, method, file, information);
    }

    public static error(error: any, method?: string, file?: string) {
        LogService.echo(LogService.LogType.Error, method, file, error);
    }

    private static echo(logType: string, method: string, file: string, log: any) {
        // todo what to do ???
        console[logType](`[${file || ''}::${method || ''}]`, log);
    }
}
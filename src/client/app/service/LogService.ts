import { ILog, Log, LogLevel } from "../cmn/models/Log";
import { ApiService } from "./ApiService";

export class LogService {

    public static info(info: ILog | string, method?: string, file?: string) {
        LogService.log("log", method, file, info);
    }

    public static warn(warning: ILog | string, method?: string, file?: string) {
        LogService.log("warn", method, file, warning);
        //<production>
        LogService.save(LogLevel.Warn, warning, method, file);
        //</production>
    }

    public static error(error: ILog | string, method?: string, file?: string) {
        LogService.log("error", method, file, error);
        //<production>
        LogService.save(LogLevel.Error, error, method, file);
        //</production>
    }

    private static log(logType: string, method: string, file: string, log: any) {
        console[logType](`[${file || ""}::${method || ""}]`, log);
    }

    private static save(level: LogLevel, log: ILog | string, method?: string, file?: string) {
        //<production>
        const message = "string" === typeof log ? log : log.message;
        const logModel = new Log({ level, message, method, file });
        // saving log to api server
        ApiService.getInstance().post<ILog>("log", logModel.getValues())
            // tslint:disable-next-line:no-console
            .catch((error) => console.error("[LogService::save]", error));
        //</production>
    }
}

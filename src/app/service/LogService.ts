import { ILog, Log, LogLevel } from "../cmn/models/Log";
import { ApiService } from "./ApiService";
import { appConfig } from "../config/appConfig";

export class LogService {

    public static info(info: ILog | string, method?: string, file?: string) {
        LogService.log("log", method, file, info);
    }

    public static warn(warning: ILog | string, method?: string, file?: string) {
        LogService.log("warn", method, file, warning);
        LogService.save(LogLevel.Warn, warning, method, file);
    }

    public static error(error: ILog | string, method?: string, file?: string) {
        LogService.log("error", method, file, error);
        LogService.save(LogLevel.Error, error, method, file);
    }

    private static log(logType: string, method: string, file: string, log: any) {
        console[logType](`[${file || ""}::${method || ""}]`, log);
    }

    private static save(level: LogLevel, log: ILog | string, method?: string, file?: string) {
        if (appConfig.env !== "production") { return; }
        const message = "string" === typeof log ? log : log.message;
        const logModel = new Log({ level, message, method, file });
        // saving log to api server
        ApiService.getInstance().post<ILog>("log", logModel.getValues())
            // tslint:disable-next-line:no-console
            .catch((error) => console.error("[LogService::save]", error));
    }
}

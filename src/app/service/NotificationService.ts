import { Dispatcher } from "./Dispatcher";
import { TranslateService } from "./TranslateService";

export const enum MessageType { Info = 1, Success, Warning, Error }

export interface IToastData {
    message: string;
    type: MessageType;
}

export class NotificationService {

    public static getInstance(dispatcher: Dispatcher = Dispatcher.getInstance()): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService(dispatcher);
        }
        return NotificationService.instance;
    }

    private static instance: NotificationService;
    private tr = TranslateService.getInstance().translate;

    private constructor(private dispatcher: Dispatcher) {
    }

    public success(message: string, ...placeholders: any[]) {
        this.toast(message, MessageType.Success, placeholders);
    }

    public error(message: string, ...placeholders: any[]) {
        this.toast(message, MessageType.Error, placeholders);
    }

    public warning(message: string, ...placeholders: any[]) {
        this.toast(message, MessageType.Warning, placeholders);
    }

    public toast(message: string, type: MessageType = MessageType.Info, ...placeholders: any[]) {
        const text = this.tr(message, placeholders);
        this.dispatcher.dispatch<IToastData>("toast", { message: text, type });
        /// <development>
        // tslint:disable-next-line:no-console
        console.log(text);
        /// </development>
    }
}

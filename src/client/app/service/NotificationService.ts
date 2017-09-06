import {Dispatcher} from "./Dispatcher";
import {ConfigService} from "./ConfigService";

export const enum MessageType{Info = 1, Success, Warning, Error}

export interface IToastData {
    message: string;
    type: MessageType;
}

export class NotificationService {

    static instance: NotificationService;
    private isProduction = true;

    constructor(private dispatcher: Dispatcher) {
        this.isProduction = ConfigService.getConfig().env === 'production';
    }

    public success(message: string) {
        this.toast(message, MessageType.Success);
    }

    public error(message: string) {
        this.toast(message, MessageType.Error);
    }

    public warning(message: string) {
        this.toast(message, MessageType.Warning);
    }

    public toast(message: string, type: MessageType = MessageType.Info) {
        this.dispatcher.dispatch<IToastData>('toast', {message, type});
        if (!this.isProduction) {
            console[type] ? console[type](message) : console.log(message);
        }
    }

    public static getInstance(dispatcher: Dispatcher = Dispatcher.getInstance('main')): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService(dispatcher);
        }
        return NotificationService.instance;
    }
}
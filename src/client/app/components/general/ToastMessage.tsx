import React, { PureComponent } from "react";
import { Dispatcher } from "../../service/Dispatcher";
import { IToastData, MessageType } from "../../service/NotificationService";
import { IBaseComponentProps } from "../BaseComponent";

export interface IToastMessageProps extends IBaseComponentProps {
}

export interface IToastMessageState {
    message: string;
    type: MessageType;
}

export class ToastMessage extends PureComponent<IToastMessageProps, IToastMessageState> {

    private timer;
    private delay = 2000;

    constructor(props: IToastMessageProps) {
        super(props);
        Dispatcher.getInstance().register<IToastData>("toast", (payload) => {
            this.setState({ message: payload.message, type: payload.type });
            return false;
        });
        this.state = { message: null, type: null };
    }

    public render() {
        const message = this.state.message ? this.getToast() : null;
        if (message) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({ message: null });
            }, this.delay);
            return <div className="toast-wrapper">{message}</div>;
        }
        return null;
    }

    private getToast() {
        let className = "info";
        switch (this.state.type) {
            case MessageType.Warning:
                className = "warning";
                break;
            case MessageType.Error:
                className = "error";
                break;
            case MessageType.Success:
                className = "success";
                break;
        }
        className = `toast type-${className}`;
        return <div className={className}>{this.state.message}</div>;
    }
}

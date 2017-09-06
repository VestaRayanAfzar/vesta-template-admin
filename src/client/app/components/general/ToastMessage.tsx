import React from "react";
import {IToastData, MessageType} from "../../service/NotificationService";
import {Dispatcher} from "../../service/Dispatcher";

export interface ToastMessageProps {
}

export interface ToastMessageState {
    message: string;
    type: MessageType;
}

export class ToastMessage extends React.Component<ToastMessageProps, ToastMessageState> {

    private timer;
    private delay = 2000;

    constructor(props: ToastMessageProps) {
        super(props);
        Dispatcher.getInstance().register<IToastData>('toast', payload => {
            this.toast(payload.message, payload.type);
            return false;
        });
        this.state = {message: null, type: null};
    }

    public toast(message: string, type: MessageType) {
        this.setState({message, type});
    }

    private getToast() {
        let className = 'info';
        switch (this.state.type) {
            case MessageType.Warning:
                className = 'warning';
                break;
            case MessageType.Error:
                className = 'error';
                break;
            case MessageType.Success:
                className = 'success';
                break;
        }
        className = `toast type-${className}`;
        return <div className={className}>{this.state.message}</div>;
    }

    public render() {
        let message = this.state.message ? this.getToast() : null;
        if (message) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setState({message: null});
            }, this.delay);
        }
        return (
            <div className="toast-wrapper">{message}</div>
        );
    }
}

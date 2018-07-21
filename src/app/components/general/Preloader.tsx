import React, { PureComponent } from "react";
import { TranslateService } from "../../service/TranslateService";
import { IBaseComponentProps } from "../BaseComponent";
import { Dialog } from "./Dialog";

export const enum PreloaderType { Text = 1, Linear, Circular, Progress }

export interface IPreloaderProps extends IBaseComponentProps {
    show: boolean;
    type?: PreloaderType;
    title?: string;
    message?: string;
}

interface IPreloaderState { }

export class Preloader extends PureComponent<IPreloaderProps, IPreloaderState> {
    private waitMessage;
    private inProgressMessage;
    private show;

    constructor(props: IPreloaderProps) {
        super(props);
        // translate messages
        const tr = TranslateService.getInstance().translate;
        this.waitMessage = tr("msg_inprogress");
        this.inProgressMessage = tr("msg_wait");
        this.state = {};
    }

    public componentWillReceiveProps(newProps: IPreloaderProps) {
        if (newProps.show == true) {
            this.show = false;
        }
    }

    public render() {
        const { show, title = this.waitMessage, message = this.inProgressMessage } = this.props;
        const preloader = this.getPreloader();

        if (show && !this.show) {
            setTimeout(() => {
                this.show = true;
                this.forceUpdate();
            }, 900);
        }
        if (!this.show || !show) {
            return <Dialog show={false} />;
        }

        return (
            <Dialog show={true} modalClassName="preloader-modal">
                <div className="preloader">
                    {preloader}
                    <div className="pl-text">
                        <h3 className="pl-title">{title}</h3>
                        {message ? <p className="pl-message">{message}</p> : null}
                    </div>
                </div>
            </Dialog>
        );
    }

    private getPreloader() {
        const { type } = this.props;
        let preloader = null;
        switch (type) {
            default:
                preloader = <div className="pl-circular" />;
                break;
        }
        return (
            <div className="pl-wrapper">
                {preloader}
            </div>
        );
    }
}

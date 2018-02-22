import React, {PureComponent} from "react";
import {Dialog} from "./Dialog";
import {TranslateService} from "../../service/TranslateService";
import {IBaseComponentProps} from "../BaseComponent";

export const enum PreloaderType {Text = 1, Linear, Circular, Progress}

export interface PreloaderProps extends IBaseComponentProps {
    show: boolean;
    type?: PreloaderType;
    title?: string;
    message?: string;
}

export class Preloader extends PureComponent<PreloaderProps, null> {
    private waitMessage;
    private inProgressMessage;

    constructor(props: PreloaderProps) {
        super(props);
        // translate messages
        const tr = TranslateService.getInstance().translate;
        this.waitMessage = tr('msg_inprogress');
        this.inProgressMessage = tr('msg_wait');
    }

    private getPreloader() {
        const {type} = this.props;
        let preloader = null;
        switch (type) {
            default:
                preloader = <div className="pl-circular"/>;
                break;
        }
        return (
            <div className="pl-wrapper">
                {preloader}
            </div>
        );
    }

    public render() {
        let {show, title, message} = this.props;
        title = title || this.waitMessage;
        message = message || this.inProgressMessage;
        const preloader = this.getPreloader();

        return show ?
            <Dialog show={true} modalClassName="preloader-modal">
                <div className="preloader">
                    {preloader}
                    <div className="pl-text">
                        <h3 className="pl-title">{title}</h3>
                        {message ? <p className="pl-message">{message}</p> : null}
                    </div>
                </div>
            </Dialog> : <Dialog show={false}/>;
    }
}
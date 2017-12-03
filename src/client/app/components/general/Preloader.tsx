import React, {PureComponent} from "react";
import {Dialog} from "./Dialog";
import {TranslateService} from "../../service/TranslateService";
import {BaseComponentProps} from "../BaseComponent";

export const enum PreloaderType {Text = 1, Linear, Circular, Progress}

export interface PreloaderProps extends BaseComponentProps {
    show: boolean;
    type?: PreloaderType;
    title?: string;
    subTitle?: string;
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

    public render() {
        let {show, title, subTitle, message} = this.props;
        title = title || this.waitMessage;
        subTitle = subTitle || this.inProgressMessage;

        return show ?
            <Dialog show={true} modalClassName="preloader-modal">
                <div className="preloader-component">
                    <div>
                        <h2>{title}</h2>
                        <h3>{subTitle}</h3>
                        {message ? <p>{message}</p> : null}
                    </div>
                </div>
            </Dialog> : <Dialog show={false}/>;
    }
}
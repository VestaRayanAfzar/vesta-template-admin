import React, {PureComponent} from "react";
import {Dialog} from "./Dialog";
import {TranslateService} from "../../service/TranslateService";
import {BaseComponentProps} from "../BaseComponent";

export const enum PreloaderType {Text = 1, Linear, Circular, Progress}

export interface PreloaderProps extends BaseComponentProps {
    show: boolean;
    type?: PreloaderType;
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
        const {show, message} = this.props;
        return show ?
            <Dialog show={true} modal={true}>
                <div className="preloader-component">
                    <div>
                        <h2>{this.waitMessage}</h2>
                        <h3>{this.inProgressMessage}</h3>
                        {message ? <p>{message}</p> : null}
                    </div>
                </div>
            </Dialog> : <Dialog show={false}/>;
    }
}
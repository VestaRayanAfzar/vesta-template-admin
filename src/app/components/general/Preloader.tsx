import { Culture, Dispatcher } from "@vesta/core";
import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../BaseComponent";
import { Dialog } from "./Dialog";

export interface IPreloaderProps extends IBaseComponentProps {
    title?: string;
    message?: string;
}

interface IPreloaderState {
    show?: boolean;
}

export class Preloader extends PureComponent<IPreloaderProps, IPreloaderState> {

    public static hide(force?: boolean) {
        Dispatcher.getInstance().dispatch("preloader", { show: false });
        Preloader.counter = force ? 0 : Preloader.counter - 1;
        if (Preloader.counter < 0) {
            Preloader.counter = 0;
        }
    }

    public static show() {
        Preloader.counter++;
        Dispatcher.getInstance().dispatch("preloader", { show: true });
    }

    private static counter = 0;
    private waitMessage;
    private inProgressMessage;
    // private show;

    constructor(props: IPreloaderProps) {
        super(props);
        // translate messages
        const tr = Culture.getDictionary().translate;
        this.waitMessage = tr("msg_inprogress");
        this.inProgressMessage = tr("msg_wait");
        this.state = {};
    }

    public componentDidMount() {
        Dispatcher.getInstance().register("preloader", (payload: IPreloaderState) => {
            this.setState({ show: payload.show });
        });
    }

    public render() {
        const { title = this.waitMessage, message = this.inProgressMessage } = this.props;
        const { show } = this.state;

        // if (show && !this.show) {
        //     setTimeout(() => {
        //         this.show = true;
        //         this.forceUpdate();
        //     }, 900);
        // }
        // if (!this.show || !show) {
        //     return <Dialog show={false} />;
        // }

        return (
            <Dialog show={show && Preloader.counter > 0} modalClassName="preloader-modal">
                <div className="preloader">
                    <div className="pl-wrapper">
                        <div className="pl-circular" />
                    </div>
                    <div className="pl-text">
                        <h3 className="pl-title">{title}</h3>
                        {message ? <p className="pl-message">{message}</p> : null}
                    </div>
                </div>
            </Dialog>
        );
    }
}

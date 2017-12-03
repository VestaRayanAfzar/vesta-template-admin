import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";
import {Dialog} from "./Dialog";
import {TranslateService} from "../../service/TranslateService";

export enum MessageBoxType {Info = 1, Success, Error, Warning}

export enum MessageBoxBtn {Ok = 1, Cancel, Retry}

export enum MessageBoxBtnGroup {OK, OkCancel = 1, OkCancelRetry, CancelRetry}

export interface MessageBoxProps extends BaseComponentProps {
    show: boolean;
    title?: string;
    type?: MessageBoxType;
    btnGroup?: MessageBoxBtnGroup;
    onAction?: (btn: MessageBoxBtn) => void;
}

export interface MessageBoxState {
}

export class MessageBox extends PureComponent<MessageBoxProps, MessageBoxState> {
    private tr = TranslateService.getInstance().translate;

    constructor(props: MessageBoxProps) {
        super(props);
        this.state = {};
    }

    private renderOkBtn(key: number) {
        return <button className="btn btn-primary" key={key} onClick={this.onBtnClick}
                       data-key={MessageBoxBtn.Ok}>{this.tr('ok')}</button>
    }

    private renderCancelBtn(key: number) {
        return <button className="btn btn-default" key={key} onClick={this.onBtnClick}
                       data-key={MessageBoxBtn.Cancel}>{this.tr('cancel')}</button>
    }

    private renderRetryBtn(key: number) {
        return <button className="btn btn-primary" key={key} onClick={this.onBtnClick}
                       data-key={MessageBoxBtn.Retry}>{this.tr('retry')}</button>
    }

    private renderMessageBoxBtnGroup() {
        switch (this.props.btnGroup) {
            case MessageBoxBtnGroup.CancelRetry:
                return [
                    this.renderRetryBtn(2),
                    this.renderCancelBtn(1),
                ];
            case MessageBoxBtnGroup.OkCancel:
                return [
                    this.renderOkBtn(1),
                    this.renderCancelBtn(2),
                ]
            case MessageBoxBtnGroup.OkCancelRetry:
                return [
                    this.renderOkBtn(1),
                    this.renderRetryBtn(2),
                    this.renderCancelBtn(3),
                ]
            default:
                return [this.renderOkBtn(1)];
        }
    }

    private onBtnClick = (e) => {
        this.onAction(+e.target.getAttribute('data-key'));
    }

    private onAction = (btn: MessageBoxBtn) => {
        const {onAction} = this.props;
        onAction && onAction(btn);
    }

    public render() {
        let {title, show, type} = this.props;

        return (
            <Dialog show={show} title={title} className={`msg-box msg-box-${type}`}>
                <div className="msg-box-content">
                    {this.props.children}
                </div>
                <div className="btn-group">
                    {this.renderMessageBoxBtnGroup()}
                </div>
            </Dialog>
        )
    }
}

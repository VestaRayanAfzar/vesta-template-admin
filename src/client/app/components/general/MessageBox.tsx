import React, { PureComponent } from "react";
import { TranslateService } from "../../service/TranslateService";
import { IBaseComponentProps } from "../BaseComponent";
import { Dialog } from "./Dialog";

export enum MessageBoxType { Info = 1, Success, Error, Warning }

export enum MessageBoxBtn { Ok = 1, Cancel, Retry, Yes, No }

export enum MessageBoxBtnGroup { OK, OkCancel = 1, OkCancelRetry, CancelRetry, YesNo }

export interface IMessageBoxProps extends IBaseComponentProps {
    show: boolean;
    title?: string;
    type?: MessageBoxType;
    btnGroup?: MessageBoxBtnGroup;
    onAction?: (btn: MessageBoxBtn) => void;
}

export interface IMessageBoxState {
}

export class MessageBox extends PureComponent<IMessageBoxProps, IMessageBoxState> {
    private tr = TranslateService.getInstance().translate;

    constructor(props: IMessageBoxProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { title, show, type, children } = this.props;
        const messageBoxBtns = this.renderMessageBoxBtnGroup();
        let content = children;
        if (children && (children as any).length) {
            content = children[0];
            messageBoxBtns.push(children[1]);
        }

        return (
            <Dialog show={show} title={title} className={`msg-box msg-box-${type}`}>
                <div className="msg-box-content">
                    {content}
                </div>
                <div className="btn-group">
                    {messageBoxBtns}
                </div>
            </Dialog>
        );
    }

    private renderOkBtn(key: number) {
        return (
            <button className="btn btn-primary" key={key} onClick={this.onBtnClick}
                data-key={MessageBoxBtn.Ok}>{this.tr("ok")}</button>);
    }

    private renderCancelBtn(key: number) {
        return <button className="btn btn-outline" key={key} onClick={this.onBtnClick}
            data-key={MessageBoxBtn.Cancel}>{this.tr("cancel")}</button>;
    }

    private renderRetryBtn(key: number) {
        return <button className="btn btn-primary" key={key} onClick={this.onBtnClick}
            data-key={MessageBoxBtn.Retry}>{this.tr("retry")}</button>;
    }

    private renderYesBtn(key: number) {
        return <button className="btn btn-primary" key={key} onClick={this.onBtnClick}
            data-key={MessageBoxBtn.Yes}>{this.tr("yes")}</button>;
    }

    private renderNoBtn(key: number) {
        return <button className="btn btn-outline" key={key} onClick={this.onBtnClick}
            data-key={MessageBoxBtn.No}>{this.tr("no")}</button>;
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
                ];
            case MessageBoxBtnGroup.OkCancelRetry:
                return [
                    this.renderOkBtn(1),
                    this.renderRetryBtn(2),
                    this.renderCancelBtn(3),
                ];
            case MessageBoxBtnGroup.YesNo:
                return [
                    this.renderYesBtn(1),
                    this.renderNoBtn(2),
                ];
            default:
                return [this.renderOkBtn(1)];
        }
    }

    private onBtnClick = (e) => {
        this.onAction(+e.target.getAttribute("data-key"));
    }

    private onAction = (btn: MessageBoxBtn) => {
        const { onAction } = this.props;
        if (onAction) {
            onAction(btn);
        }
    }
}

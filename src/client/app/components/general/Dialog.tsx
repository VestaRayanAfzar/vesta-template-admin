import React, {EventHandler, PureComponent, ReactChild} from "react";
import {BaseComponentProps} from "../BaseComponent";
import {Modal} from "./Modal";

export interface DialogProps extends BaseComponentProps {
    title?: string;
    modal?: boolean;
    show: boolean;
    onClose?: EventHandler<any>;
    className?: string;
}

export class Dialog extends PureComponent<DialogProps, null> {

    private renderHeader() {
        const {title, onClose} = this.props;
        const titlebar = title ? <h3>{title}</h3> : null;
        const closeBtn = onClose ? <button className="btn" onClick={close}>X</button> : null;
        return titlebar || closeBtn ? <div className="dialog-header">
            {titlebar}
            {closeBtn}
        </div> : null;
    }

    public render() {
        const {modal, show, className} = this.props;
        if (!show) return null;
        const children: Array<ReactChild> = this.props.children as Array<ReactChild>;
        let content = null;
        let footer = null;
        if (children.length == 2) {
            content = children[0];
            footer = <div className="dialog-footer">{children[1]}</div>;
        } else {
            content = children;
        }
        const header = this.renderHeader();
        const dialog = (
            <div className={`dialog-component${className ? ` ${className}` : ''}`}>
                {header}
                <div className="dialog-content">{content}</div>
                {footer}
            </div>
        );

        return modal ? <Modal show={true} name="modal-zoom">{dialog}</Modal> : dialog;
    }
}
import React, { EventHandler, PureComponent, ReactChild } from "react";
import { IBaseComponentProps } from "../BaseComponent";
import { Modal } from "./Modal";

export interface IDialogProps extends IBaseComponentProps {
    title?: string;
    show: boolean;
    onClose?: EventHandler<any>;
    className?: string;
    modalClassName?: string;
}

export class Dialog extends PureComponent<IDialogProps, null> {

    public render() {
        const { show, className, modalClassName } = this.props;
        const children: ReactChild[] = this.props.children as ReactChild[];
        let content = null;
        let footer = null;
        if (children && children.length) {
            content = children[0];
            footer = <div className="dialog-footer">{children[1]}</div>;
        } else {
            content = children;
        }
        const header = this.renderHeader();

        return (
            <Modal show={show} name="modal-zoom" className={modalClassName}>
                <div className={`dialog ${className ? `${className}` : ""}`}>
                    {header}
                    <div className="dialog-content">{content}</div>
                    {footer}
                </div>
            </Modal>
        );
    }

    private renderHeader() {
        const { title, onClose } = this.props;
        const titlebar = title ? <h3>{title}</h3> : null;
        const closeBtn = onClose ? <span className="btn" onClick={onClose}>X</span> : null;
        return titlebar || closeBtn ? <div className="dialog-header">
            {titlebar}
            {closeBtn}
        </div> : null;
    }
}

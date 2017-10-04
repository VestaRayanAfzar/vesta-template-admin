import React, {EventHandler} from "react";
import {PageComponentProps} from "../PageComponent";
import {Modal} from "./Modal";

export interface DialogOptions {
    showCloseBtn?: boolean;
    title?: string;
    modal?: boolean;
    show?: boolean;
    close: EventHandler<any>;
}

export interface DialogParams {
}

export interface DialogProps extends PageComponentProps<DialogParams> {
    options: DialogOptions;
}

export const Dialog = (props: DialogProps) => {
    const options = props.options;

    const dialog = <div className="dialog-component">
        {renderHeader()}
        <div className="dialog-content">{props.children}</div>
        {renderFooter()}
    </div>;
    return props.options.modal ? <Modal close={options.close}>{dialog}</Modal> : dialog;

    function renderHeader() {
        const titlebar = options.title ? <h1>{options.title}</h1> : null;
        const closeBtn = options.showCloseBtn ? <button type="button" onClick={options.close}>X</button> : null;
        return titlebar ? <div className="dialog-header">
            {titlebar}
            {closeBtn}
        </div> : null;
    }

    function renderFooter() {
        return null;
    }
};
import React, {MouseEventHandler} from "react";
import {PageComponentProps} from "../PageComponent";

export interface ModalParams {
}

export interface ModalProps extends PageComponentProps<ModalParams> {
    show?: boolean;
    clickToClose?: boolean;
    close: MouseEventHandler<any>;
}

export const Modal = (props: ModalProps) => {
    const show = 'show' in props ? props.show : true;
    return show ? (
        <div className="modal-component" onClick={props.clickToClose ? props.close : null}>
            {props.children}
        </div>
    ) : null;
};
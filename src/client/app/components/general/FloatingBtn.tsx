import React, {MouseEventHandler, PureComponent} from "react";
import {IBaseComponentProps} from "../BaseComponent";

export interface FloatingBtnProps extends IBaseComponentProps {
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export class FloatingBtn extends PureComponent<FloatingBtnProps, null> {

    public render() {
        const {className, onClick, children} = this.props;

        return (
            <div className={`floating-btn ${className}`}>
                <button type='button' onClick={onClick}>{children}</button>
            </div>
        )
    }
}


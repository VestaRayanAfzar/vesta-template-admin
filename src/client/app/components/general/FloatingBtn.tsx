import React, {MouseEventHandler} from "react";
import {PageComponentProps} from "../PageComponent";

export interface FloatingBtnParams {
}

export interface FloatingBtnProps extends PageComponentProps<FloatingBtnParams> {
    title?: string;
    icon?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const FloatingBtn = (props: FloatingBtnProps) => {
    return (<div className={`floatingBtn-component ${props.className}`}>
        <button onClick={props.onClick}>{props.title}</button>
    </div>);
};


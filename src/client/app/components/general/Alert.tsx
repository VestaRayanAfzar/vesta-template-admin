import React from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface AlertProps extends BaseComponentProps {
    type?: string;
}

export const Alert = (props: AlertProps) => {
    const className = `alert-component alert-${props.type}`;
    return (
        <p className={className}>
            {props.children}
        </p>
    )
};
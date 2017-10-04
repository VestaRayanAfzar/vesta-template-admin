import * as React from "react";
import {PageComponentProps} from "../PageComponent";

export interface AlertParams {
}

export interface AlertProps extends PageComponentProps<AlertParams> {
    type?: string;
}

export const Alert = (props: AlertProps) => {
    const className = `alert-component alert-${props.type}`;
    return (
        <div className={className}>
            {props.children}
        </div>
    )
};
import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../BaseComponent";

interface IAlertProps extends IBaseComponentProps {
    type?: string;
}

export class Alert extends PureComponent<IAlertProps, null> {

    public render() {
        const { type, children } = this.props;

        return (
            <p className={`alert alert-${type}`}>
                {children}
            </p>
        );
    }
}

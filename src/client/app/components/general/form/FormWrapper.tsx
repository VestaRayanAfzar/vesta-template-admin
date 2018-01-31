import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";

export interface ChangeEventHandler {
    (name: string, value: any): void;
}

export interface FormOption {
    id: number;
    title: string;
}

export interface FormWrapperProps extends BaseComponentProps {
    name?: string;
    onSubmit?: (e: Event) => void;
}

export class FormWrapper extends PureComponent<FormWrapperProps, null> {

    private onSubmit = (e) => {
        const {onSubmit} = this.props
        e.preventDefault();
        onSubmit && onSubmit(e);
    }

    public render() {
        return (
            <div className="form-wrapper">
                <form name={this.props.name} onSubmit={this.onSubmit} noValidate>
                    {this.props.children}
                </form>
            </div>
        )
    }
}
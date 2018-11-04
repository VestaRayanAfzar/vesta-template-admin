import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";

export type ChangeEventHandler = (name: string, value: any) => void;

export interface IFromControlProps {
    error?: string;
    label?: string;
    name?: string;
    onChange?: ChangeEventHandler;
    placeholder?: boolean;
    readonly?: boolean;
    value?: any;
}

export interface IFormOption {
    id: number;
    title: string;
}

interface IFormWrapperProps extends IBaseComponentProps {
    name?: string;
    onSubmit?: (e: Event) => void;
}

export class FormWrapper extends PureComponent<IFormWrapperProps, null> {

    public render() {
        return (
            <div className="form-wrapper">
                <form name={this.props.name} onSubmit={this.onSubmit} noValidate={true}>
                    {this.props.children}
                </form>
            </div>
        );
    }

    private onSubmit = (e) => {
        const { onSubmit } = this.props;
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    }
}

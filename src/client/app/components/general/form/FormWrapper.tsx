import React from "react";
import {PageComponentProps} from "../../PageComponent";
import {IModelValues} from "../../../medium";

export interface ChangeEventHandler {
    (name: string, value: any): void;
}

export interface SubmitEventHandler {
    (model: IModelValues): void;
}

export interface FormOption {
    title: string;
    value: any;
}

export interface FormWrapperParams {
}

export interface FormWrapperProps extends PageComponentProps<FormWrapperParams> {
    name?: string;
    isUpdate?: boolean;
    onSubmit: SubmitEventHandler;
    model?: IModelValues;
}

export const FormWrapper = (props: FormWrapperProps) => {
    return (
        <div className="formWrapper-component">
            <form name={props.name} onSubmit={onSubmit}>
                {props.children}
            </form>
        </div>
    )

    function onSubmit(e) {
        e.preventDefault();
        props.onSubmit(props.model);
    }
};
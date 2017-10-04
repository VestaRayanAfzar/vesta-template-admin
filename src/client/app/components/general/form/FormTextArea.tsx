import React from "react";
import {PageComponentProps} from "../../PageComponent";
import {ChangeEventHandler} from "./FormWrapper";
import {FormError} from "./FormError";

export interface FormTextAreaParams {
}

export interface FormTextAreaProps extends PageComponentProps<FormTextAreaParams> {
    label: string;
    name: string;
    value?: string;
    onChange?: ChangeEventHandler;
    error?: string;
}

export const FormTextArea = (props: FormTextAreaProps) => {
    return <div className="form-group">
        <div className="formTextArea-component">
            <label htmlFor={props.name}>{props.label}</label>
            <textarea className="form-control" name={props.name} id={props.name} value={props.value}
                      onChange={e => props.onChange(props.name, e.target.value)}/>
        </div>
        <FormError error={props.error}/>
    </div>;
};


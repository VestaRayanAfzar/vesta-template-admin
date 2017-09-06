import React from "react";
import {PageComponentProps} from "../../PageComponent";
import {ChangeEventHandler} from "./FormWrapper";
import {FormError} from "./FormError";

export interface FormTextInputParams {
}

export interface FormTextInputProps extends PageComponentProps<FormTextInputParams> {
    label: string;
    name: string;
    value?: string;
    onChange?: ChangeEventHandler;
    error?: string;
    secret?: boolean;
}

export const FormTextInput = (props: FormTextInputProps) => {
    return <div className="form-group">
        <div className="formTextInput-component">
            <label htmlFor={props.name}>{props.label}</label>
            <input className="form-control" type={props.secret ? 'password' : 'text'} name={props.name} id={props.name}
                   value={props.value || ''} onChange={e => props.onChange(props.name, e.target.value)}/>
        </div>
        <FormError error={props.error}/>
    </div>;
};


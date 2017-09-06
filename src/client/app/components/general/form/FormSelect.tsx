import React from "react";
import {PageComponentProps} from "../../PageComponent";
import {ChangeEventHandler, FormOption} from "./FormWrapper";
import {FormError} from "./FormError";

export interface FormSelectParams {
}

export interface FormSelectProps extends PageComponentProps<FormSelectParams> {
    name: string;
    label: string;
    value?: number | string;
    onChange?: ChangeEventHandler;
    options: Array<FormOption>;
    error?: string;
}

export const FormSelect = (props: FormSelectProps) => {
    const options = [{title: '', value: ''}].concat(props.options).map((o, i) => (
        <option key={i} value={o.value}>{o.title}</option>));
    return <div className="form-group">
        <div className="formSelect-component">
            <label htmlFor={props.name}>{props.label}</label>
            <select className="form-control" name={props.name} id={props.name} value={props.value}
                    onChange={e => props.onChange(props.name, e.target.value)}>
                {options}
            </select>
        </div>
        <FormError error={props.error}/>
    </div>
};


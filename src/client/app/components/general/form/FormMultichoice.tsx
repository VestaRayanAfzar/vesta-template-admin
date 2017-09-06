import React from "react";
import {PageComponentProps} from "../../PageComponent";
import {ChangeEventHandler, FormOption} from "./FormWrapper";
import {FormError} from "./FormError";

export interface FormMultichoiceParams {
}

export interface FormMultichoiceProps extends PageComponentProps<FormMultichoiceParams> {
    name: string;
    label: string;
    value?: Array<number | string>;
    onChange?: ChangeEventHandler;
    options: Array<FormOption>;
    error?: string;
}

export const FormMultichoice = (props: FormMultichoiceProps) => {
    let list: HTMLUListElement = null;
    let choices = props.options.map((o, i) => <li key={i}>
        <label>
            <input name={props.name} type="checkbox" value={o.value}
                   checked={props.value && props.value.indexOf(o.value) >= 0} onChange={onChange}/> {o.title}
        </label>
    </li>);

    return <div className="form-group">
        <div className="formMultichoice-component">
            <label>{props.label}</label>
            <ul ref={el => list = el}>{choices}</ul>
        </div>
        <FormError error={props.error}/>
    </div>;

    function onChange(e) {
        let value = [];
        let checkBoxes = list.querySelectorAll('input');
        for (let i = 0, il = checkBoxes.length; i < il; ++i) {
            if (checkBoxes[i].checked) {
                value.push(checkBoxes[i].value);
            }
        }
        props.onChange(props.name, value);
    }
};
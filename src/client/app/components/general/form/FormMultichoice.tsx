import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormMultichoiceProps extends BaseComponentProps {
    name: string;
    label: string;
    options: Array<{}>;
    titleKey?: string;
    valueKey?: string;
    value?: Array<any>;
    onChange?: ChangeEventHandler;
    error?: string;
}

export class FormMultichoice extends PureComponent<FormMultichoiceProps, null> {
    private list: HTMLUListElement;

    private onChange = (e) => {
        let values: Array<any> = [];
        let checkBoxes = this.list.querySelectorAll('input');
        for (let i = 0, il = checkBoxes.length; i < il; ++i) {
            if (checkBoxes[i].checked) {
                let value = checkBoxes[i].value;
                let numericValue = +value;
                values.push(isNaN(numericValue) ? value : numericValue);
            }
        }
        this.props.onChange(this.props.name, values.length ? values : null);
    }

    public render() {
        let {options, value, label, error, titleKey, valueKey} = this.props;
        if (!titleKey) titleKey = 'title';
        if (!valueKey) valueKey = 'value';
        let choices = options.map((o, i) => (
            <li key={i}>
                <label>
                    <input name={name} type="checkbox" value={o[valueKey]}
                           checked={value && value.indexOf(o[valueKey]) >= 0}
                           onChange={this.onChange}/> {o[titleKey]}
                </label>
            </li>));

        return (
            <div className={`form-group multichoice-input${error ? ' has-error' : ''}`}>
                <label>{label}</label>
                <p className="form-error">{error || ''}</p>
                <ul ref={el => this.list = el}>{choices}</ul>
            </div>
        )
    }
}
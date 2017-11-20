import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormSelectProps extends BaseComponentProps {
    name: string;
    label: string;
    value?: any;
    onChange?: ChangeEventHandler;
    options: Array<{}>;
    error?: string;
    placeholder?: boolean;
    //
    titleKey?: string;
    valueKey?: string;
}

export class FormSelect extends PureComponent<FormSelectProps, null> {

    private onChange = (e) => {
        let {name, onChange} = this.props;
        let value = e.target.value;
        let numericValue = +value;
        if (isNaN(numericValue)) return onChange(name, value);
        onChange(name, numericValue);

    }

    public render() {
        let {label, name, value, options, error, placeholder, titleKey, valueKey} = this.props;
        if (!titleKey) titleKey = 'title';
        if (!valueKey) valueKey = 'value';
        const optionsList = [{[titleKey]: placeholder ? label : '', [valueKey]: ''}].concat(options)
            .map((o, i) => (<option key={i} value={o[valueKey]}>{o[titleKey]}</option>));
        return (
            <div className={`form-group select-input${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <select className="form-control" name={name} id={name} value={value || undefined}
                        onChange={this.onChange}>
                    {optionsList}
                </select>
                <p className="form-error">{error || ''}</p>
            </div>
        )
    }
}


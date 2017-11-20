import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormNumericInputProps extends BaseComponentProps {
    label: string;
    name: string;
    value?: number | string;
    onChange?: ChangeEventHandler;
    error?: string;
    step?: number;
    format?: boolean;
    placeholder?: boolean;
}

export class FormNumericInput extends PureComponent<FormNumericInputProps, null> {

    private format(value): string {
        if (!value) return value;
        return this.props.format ? (+value).toLocaleString() : value;
    }

    private onChange = (e) => {
        this.props.onChange(this.props.name, +e.target.value);
    }

    public render() {
        let {label, name, value, step, error, placeholder} = this.props;
        step = step || 1;
        return (
            <div className={`form-group numeric-input${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" name={name} id={name} type="number"
                       placeholder={placeholder ? label : ''}
                       value={this.format(value || '')} onChange={this.onChange} step={step}/>
                <p className="form-error">{error || ''}</p>
            </div>
        )
    }
}
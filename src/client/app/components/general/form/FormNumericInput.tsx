import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { ChangeEventHandler, IFromControlProps } from "./FormWrapper";

interface IFormNumericInputProps extends IBaseComponentProps, IFromControlProps {
    format?: boolean;
    step?: number;
    value?: number | string;
}

export class FormNumericInput extends PureComponent<IFormNumericInputProps, null> {

    public render() {
        const { label, name, value, step = 1, error, placeholder } = this.props;
        const displayValue = this.format(value || "");

        return (
            <div className={`form-group numeric-input${error ? " has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" name={name} type="number" placeholder={placeholder ? label : ""} value={displayValue} onChange={this.onChange} step={step} />
                <p className="form-error">{error || ""}</p>
            </div>
        );
    }

    private format(value): string {
        if (!value) {
            return value;
        }
        return this.props.format ? (+value).toLocaleString() : value;
    }

    private onChange = (e) => {
        this.props.onChange(this.props.name, +e.target.value);
    }
}

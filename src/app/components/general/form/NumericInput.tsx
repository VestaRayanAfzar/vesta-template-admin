import React, { InputHTMLAttributes, PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

interface INumericInputProps extends IBaseComponentProps, IFromControlProps {
    format?: boolean;
    size?: number;
    step?: number;
    value?: number | string;
}

export class NumericInput extends PureComponent<INumericInputProps, null> {

    public render() {
        const { label, name, value, step, error, placeholder, size } = this.props;
        const displayValue = this.format(value || "");
        const attrs: InputHTMLAttributes<HTMLInputElement> = { className: "form-control", name, type: "number" };
        if (placeholder) {
            attrs.placeholder = label;
        }
        if (step) {
            attrs.step = step;
        }
        if (size) {
            attrs.size = size;
        }

        return (
            <div className={`form-group numeric-input ${error ? "has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input {...attrs} value={displayValue} onChange={this.onChange} />
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
        const value = e.target.value;
        this.props.onChange(this.props.name, isNaN(value) ? 0 : value);
    }
}

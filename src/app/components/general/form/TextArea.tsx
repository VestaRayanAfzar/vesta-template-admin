import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

interface ITextAreaProps extends IBaseComponentProps, IFromControlProps {
    value?: string;
}

export class TextArea extends PureComponent<ITextAreaProps, null> {

    public render() {
        const { label, name, value, error, placeholder } = this.props;

        return (
            <div className={`form-group text-area${error ? " has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <textarea className="form-control" name={name} id={name} placeholder={placeholder ? label : ""}
                    value={value || ""} onChange={this.onChange} />
                <p className="form-error">{error || ""}</p>
            </div>
        );
    }

    private onChange = (e) => {
        const { name, onChange } = this.props;
        if (onChange) {
            onChange(name, e.target.value);
        }
    }
}

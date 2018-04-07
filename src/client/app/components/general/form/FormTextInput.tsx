import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { ChangeEventHandler, IFromControlProps } from "./FormWrapper";

export interface IFormTextInputProps extends IBaseComponentProps, IFromControlProps {
    dir?: "ltr" | "rtl";
    type?: string;
    value?: string;
}

export class FormTextInput extends PureComponent<IFormTextInputProps, null> {

    public render() {
        const { label, name, value, dir, error, placeholder, readonly } = this.props;
        const type = this.props.type || "text";
        const extClassName = dir ? `dir-${dir}` : "";

        return (
            <div className={`form-group text-input ${extClassName} ${error ? "has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" type={type} name={name} id={name} placeholder={placeholder ? label : ""}
                    value={value || ""} onChange={this.onChange} disabled={readonly} />
                <p className="form-error">{error || ""}</p>
            </div>
        );
    }

    private onChange = (e) => {
        const { onChange, name, readonly } = this.props;
        if (onChange && !readonly) {
            onChange(name, e.target.value);
        }
    }
}

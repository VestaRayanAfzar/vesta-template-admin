import React from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

export interface ITextInputProps extends IBaseComponentProps, IFromControlProps {
    dir?: "ltr" | "rtl";
    type?: string;
    value?: string;
}

export function TextInput(props: ITextInputProps) {

    const type = props.type || "text";
    let extClassName = props.dir ? `dir-${props.dir}` : "";
    extClassName = props.value ? `${extClassName} dirty` : extClassName;
    extClassName = props.required ? `${extClassName} required` : extClassName;

    return (
        <div className={`form-group text-input ${extClassName} ${props.error ? "has-error" : ""}`}>
            <label htmlFor={name}>{props.label}</label>
            <input className="form-control" type={type} name={name} id={name}
                value={props.value || ""} onChange={onChange} disabled={props.readonly} />
            <p className="form-error">{props.error || ""}</p>
        </div>
    );

    function onChange(e) {
        if (props.onChange && !props.readonly) {
            props.onChange(props.name, e.target.value);
        }
    }
}

import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormTextAreaProps extends BaseComponentProps {
    label: string;
    name: string;
    value?: string;
    onChange?: ChangeEventHandler;
    error?: string;
    placeholder?: boolean;
}

export class FormTextArea extends PureComponent<FormTextAreaProps, null> {

    private onChange = (e) => {
        this.props.onChange(this.props.name, e.target.value)
    }

    public render() {
        let {label, name, value, error, placeholder} = this.props;
        return (
            <div className={`form-group text-area${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <textarea className="form-control" name={name} id={name} placeholder={placeholder ? label : ''}
                          value={value} onChange={this.onChange}/>
                <p className="form-error">{error || ''}</p>
            </div>
        )
    }
}


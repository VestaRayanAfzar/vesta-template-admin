import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormTextInputProps extends BaseComponentProps {
    label: string;
    name: string;
    value?: string;
    onChange?: ChangeEventHandler;
    error?: string;
    type?: string;
    dir?: 'ltr' | 'rtl';
    placeholder?: boolean;
}

export class FormTextInput extends PureComponent<FormTextInputProps, null> {

    private onChange = (e) => {
        this.props.onChange(this.props.name, e.target.value);
    }

    public render() {
        let {label, name, value, dir, error, type, placeholder} = this.props;
        type = type || 'text';
        let extClassName = dir ? ` dir-${dir}` : '';
        return (
            <div className={`form-group text-input${extClassName}${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" type={type} name={name} id={name} placeholder={placeholder ? label : ''}
                       value={value || ''} onChange={this.onChange}/>
                <p className="form-error">{error || ''}</p>
            </div>
        )
    }
}
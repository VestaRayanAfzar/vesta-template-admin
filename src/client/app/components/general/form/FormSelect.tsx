import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormSelectProps extends BaseComponentProps {
    name: string;
    label: string;
    options: Array<{}>;
    titleKey?: string;
    valueKey?: string;
    value?: any;
    onChange?: ChangeEventHandler;
    error?: string;
    placeholder?: boolean;
}

export class FormSelect extends PureComponent<FormSelectProps, null> {
    public static defaultProps = {valueKey: 'id', titleKey: 'title'};

    private onChange = (e) => {
        let {name, onChange} = this.props;
        let value = e.target.value;
        let numericValue = +value;
        onChange(name, isNaN(numericValue) ? value : numericValue);
    }

    public render() {
        let {label, name, value, options, error, placeholder, titleKey, valueKey} = this.props;

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


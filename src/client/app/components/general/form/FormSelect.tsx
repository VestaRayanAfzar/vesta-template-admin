import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { ChangeEventHandler, IFromControlProps } from "./FormWrapper";

interface IFormSelectProps extends IBaseComponentProps, IFromControlProps {
    options: Array<{}>;
    titleKey?: string;
    valueKey?: string;
}

export class FormSelect extends PureComponent<IFormSelectProps, null> {
    public static defaultProps = { valueKey: "id", titleKey: "title" };

    public render() {
        const { label, name, options, error, placeholder, titleKey } = this.props;
        // finding index of selected value
        const selectedIndex = this.getSelectedIndex();

        const optionsList = (options || []).map((o, i) => (<option key={i} value={i}>{o[titleKey]}</option>));
        optionsList.splice(0, 0, <option key={-1} value={-1}>{placeholder ? label : ""}</option>);

        return (
            <div className={`form-group select-input ${error ? "has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <select className="form-control" name={name} id={name} value={selectedIndex} onChange={this.onChange}>
                    {optionsList}
                </select>
                <p className="form-error">{error || ""}</p>
            </div>
        );
    }

    private getSelectedIndex() {
        const { value, options, valueKey } = this.props;
        // value might be a number or an object
        const realValue = value && value[valueKey] || value;
        // finding index of selected value
        for (let i = options.length; i--;) {
            if (realValue == options[i][valueKey]) {
                return i;
            }
        }
        // in case no value is passed through props
        return undefined;
    }

    private onChange = (e) => {
        const { name, onChange, options, valueKey } = this.props;
        const index = e.target.value;
        const item = options[index];
        onChange(name, item ? item[valueKey] : null);
    }
}

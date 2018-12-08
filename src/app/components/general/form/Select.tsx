import React from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

interface ISelectProps extends IBaseComponentProps, IFromControlProps {
    options: any[];
    titleKey?: string;
    valueKey?: string;
}

export function Select(props: ISelectProps) {
    (Select as any).defaultProps = { valueKey: "id", titleKey: "title" };

    // finding index of selected value
    const selectedIndex = getSelectedIndex();

    const optionsList = (props.options || []).map((o, i) => (<option key={i} value={i}>{o[props.titleKey]}</option>));
    optionsList.splice(0, 0, <option key={-1} value={-1}>&nbsp;</option>);

    let className = `form-group select-input ${props.error ? "has-error" : ""}`;
    className += props.value !== -1 ? " dirty" : null;

    return (
        <div className={className}>
            <label htmlFor={name}>{props.label}</label>
            <select className="form-control" name={name} id={name} value={selectedIndex}
                onChange={onChange} disabled={props.readonly}>
                {optionsList}
            </select>
            <p className="form-error">{props.error || ""}</p>
        </div>
    );

    function getSelectedIndex() {
        const { value, options, valueKey } = props;
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

    function onChange(e) {
        const index = e.target.value;
        const item = props.options[index];
        if (onChange && !props.readonly) {
            props.onChange(props.name, item ? item[props.valueKey] : null);
        }
    }
}

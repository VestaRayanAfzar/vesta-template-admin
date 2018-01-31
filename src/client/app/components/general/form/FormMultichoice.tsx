import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";
import {TranslateService} from "../../../service/TranslateService";

export interface FormMultichoiceProps extends BaseComponentProps {
    name: string;
    label: string;
    options: Array<{}>;
    titleKey?: string;
    valueKey?: string;
    value?: Array<any>;
    onChange?: ChangeEventHandler;
    error?: string;
    showSelectAll?: boolean;
}

export class FormMultichoice extends PureComponent<FormMultichoiceProps, null> {
    private selectAllText: string;
    public static defaultProps = {valueKey: 'id', titleKey: 'title'};

    constructor(props: FormMultichoiceProps) {
        super(props);
        const tr = TranslateService.getInstance();
        this.selectAllText = tr.translate('select_all');
    }

    private onChange = (e) => {
        const {value, valueKey, options} = this.props;
        let selectedValues = [].concat(value || []);
        let checked = e.currentTarget.checked;
        let thisValue = e.currentTarget.value;
        let isSelectAll = e.currentTarget.hasAttribute('data-select-all');
        let numericValue = +thisValue;

        if (checked) {
            if (isSelectAll) {
                // select all checkbox is checked
                selectedValues = options.map(option => option[valueKey]);
            } else {
                selectedValues.push(isNaN(numericValue) ? thisValue : numericValue);
            }
        } else {
            // finding index of selected checkbox's value
            let index = selectedValues.indexOf(isNaN(numericValue) ? thisValue : numericValue);
            if (index >= 0) {
                selectedValues.splice(index, 1);
            } else {
                // select all unchecked
                selectedValues = [];
            }
        }

        this.props.onChange(this.props.name, selectedValues.length ? selectedValues : null);
    }

    private renderCheckboxes() {
        const {options, value, titleKey, valueKey, showSelectAll} = this.props;
        let isAllSelected = true;
        let choices = options.map((o, i) => {
            const selected = value && value.indexOf(o[valueKey]) >= 0;
            if (!selected) {
                isAllSelected = false;
            }
            return (
                <li key={i + 1}>
                    <label>
                        <input name={name} type="checkbox" value={o[valueKey]} checked={selected}
                               onChange={this.onChange}/> {o[titleKey]}
                    </label>
                </li>)
        });
        if (showSelectAll && choices.length) {
            choices.splice(0, 0, (
                <li key={0} className="select-all-choice">
                    <label>
                        <input name={name} type="checkbox" value="" checked={isAllSelected} data-select-all
                               onChange={this.onChange}/> {this.selectAllText}
                    </label>
                </li>
            ));
        }
        return choices;
    }

    public render() {
        const {label, error} = this.props;
        let choices = this.renderCheckboxes();

        return (
            <div className={`form-group multichoice-input ${error ? 'has-error' : ''}`}>
                <label>{label}</label>
                <p className="form-error">{error || ''}</p>
                <ul>{choices}</ul>
            </div>
        )
    }
}
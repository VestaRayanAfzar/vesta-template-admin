import React, { PureComponent } from "react";
import { TranslateService } from "../../../service/TranslateService";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

interface IFormMultichoiceProps extends IBaseComponentProps, IFromControlProps {
    options: Array<{}>;
    showSelectAll?: boolean;
    titleKey?: string;
    value?: any[];
    valueKey?: string;
}

export class FormMultichoice extends PureComponent<IFormMultichoiceProps, null> {
    public static defaultProps = { valueKey: "id", titleKey: "title" };
    private selectAllText: string;

    constructor(props: IFormMultichoiceProps) {
        super(props);
        const tr = TranslateService.getInstance();
        this.selectAllText = tr.translate("select_all");
    }

    public render() {
        const { label, error } = this.props;
        const choices = this.renderCheckboxes();

        return (
            <div className={`form-group multichoice-input ${error ? "has-error" : ""}`}>
                <label>{label}</label>
                <p className="form-error">{error || ""}</p>
                <ul>{choices}</ul>
            </div>
        );
    }

    private onChange = (e) => {
        const { name, value, valueKey, options } = this.props;
        let selectedValues = [].concat(value || []);
        const checked = e.currentTarget.checked;
        const isSelectAll = e.currentTarget.hasAttribute("data-select-all");
        const index = e.currentTarget.value;
        const thisItem = options[isSelectAll ? null : index];

        if (checked) {
            if (isSelectAll) {
                // select all checkbox is checked
                selectedValues = options.map((option) => option[valueKey]);
            } else {
                selectedValues.push(thisItem[valueKey]);
            }
        } else {
            // finding index of selected checkbox's value
            const selectedIndex = thisItem ? selectedValues.indexOf(thisItem[valueKey]) : -1;
            if (selectedIndex >= 0) {
                selectedValues.splice(selectedIndex, 1);
            } else {
                // select all unchecked
                selectedValues = [];
            }
        }

        this.props.onChange(name, selectedValues.length ? selectedValues : null);
    }

    private renderCheckboxes() {
        const { options, name, value, titleKey, valueKey, showSelectAll } = this.props;
        let isAllSelected = true;
        const choices = (options || []).map((o, i) => {
            const checked = !!(value && value.indexOf(o[valueKey]) >= 0);
            if (!checked) {
                isAllSelected = false;
            }
            return (
                <li key={i}>
                    <label>
                        <input name={name} type="checkbox" value={i} checked={checked}
                            onChange={this.onChange} /> {o[titleKey]}
                    </label>
                </li>);
        });
        // select all option
        if (showSelectAll && choices.length) {
            choices.splice(0, 0, (
                <li key={-1} className="select-all-choice">
                    <label>
                        <input name={name} type="checkbox" checked={isAllSelected} data-select-all={true}
                            onChange={this.onChange} /> {this.selectAllText}
                    </label>
                </li>
            ));
        }
        return choices;
    }
}

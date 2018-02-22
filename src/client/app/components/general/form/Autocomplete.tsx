import React, { Component } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { Search } from "../../PageComponent";
import { ChangeEventHandler, IFromControlProps } from "./FormWrapper";

export enum KeyCode { Backspace = 8, Enter = 13, Escape = 27, ArrowLeft = 37, ArrowUp = 38, ArrowRight = 39, ArrowDown = 40 }

interface IAutocompleteProps extends IBaseComponentProps, IFromControlProps {
    multi?: boolean;
    search: Search<any>;
    titleKey?: string;
    valueKey?: string;
}

interface IAutocompleteState {
    items: Array<any>;
    menuIndex: number;
    showDropDown: boolean;
    showLoader: boolean;
    term: string;
}

export class Autocomplete extends Component<IAutocompleteProps, IAutocompleteState> {
    public static defaultProps = { valueKey: "id", titleKey: "title" };
    private hasStateChanged = false;
    private selectedItems: Array<any> = [];

    constructor(props: IAutocompleteProps) {
        super(props);
        this.state = { term: "", items: [], showDropDown: false, showLoader: false, menuIndex: -1 };
        this.extractInitialValues(props);
    }

    /**
     * when onChange is propagated to parent component, parent will only receive the id of selectedItem
     *  so based on react controlled-component concept, parent will again send that value as props
     *  we use hasBeenInitiated to check if it's the first time or not
     */
    public componentWillReceiveProps(nextProps: IAutocompleteProps) {
        if (this.hasStateChanged) { return; }
        this.extractInitialValues(nextProps);
    }

    public render() {
        const { name, label, error, value, titleKey, placeholder, multi } = this.props;
        const { showLoader, term } = this.state;
        const list = this.renderList();
        const selectedItems = multi ? this.renderSelectedItems() : null;
        const inputValue = term || (!multi && value && value[titleKey]) || "";
        const className = `${list ? "has-list" : ""} ${error ? "has-error" : ""} ${multi ? "is-multi" : ""} ${showLoader ? "is-loading" : ""}`;

        return (
            <div className={`form-group autocomplete-input ${className}`}>
                {placeholder ? null : <label>{label}</label>}
                <input className="form-control" onChange={this.onChange} onKeyDown={this.onKeyDown} value={inputValue} name={name} placeholder={placeholder ? label : ""} />
                {list}
                {selectedItems}
                <p className="form-error">{error || ""}</p>
            </div>
        );
    }

    private extractInitialValues(props: IAutocompleteProps) {
        const { valueKey, value, multi } = props;
        const selectedItems = [];
        if (value && multi) {
            for (let i = 0, il = value.length; i < il; ++i) {
                if (value[i][valueKey]) {
                    selectedItems.push(value[i]);
                }
            }
            if (selectedItems.length) {
                this.selectedItems = value;
            }
        }
    }

    private onChange = (e) => {
        const term = e.target.value;
        this.setState({ term });
        if (!term) {
            return this.setState({ showDropDown: false });
        }
        this.setState({ showLoader: true });
        this.props.search(term)
            .then((items) => {
                this.setState({ showLoader: false, items, menuIndex: -1, showDropDown: true });
            })
            .catch(() => {
                this.setState({ showLoader: false });
            });
    }

    private onItemDelete = (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        if (index >= 0) {
            this.selectedItems.splice(index, 1);
        }
        this.forceUpdate();
    }

    private onItemSelect = (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        this.selectItemByIndex(index);
    }

    private onKeyDown = (e) => {
        const { showDropDown, items } = this.state;
        const itemsCount = items.length;
        if (!itemsCount || !showDropDown) { return null; }
        const { menuIndex } = this.state;
        const keyCode = e.keyCode || e.charCode;
        let hasOperation = true;
        switch (keyCode) {
            case KeyCode.ArrowDown:
                this.setState({ menuIndex: (menuIndex + 1) % itemsCount });
                break;
            case KeyCode.ArrowUp:
                this.setState({ menuIndex: (menuIndex - 1 < 0 ? itemsCount - 1 : menuIndex - 1) });
                break;
            case KeyCode.Enter:
                if (menuIndex >= 0) {
                    this.selectItemByIndex(menuIndex);
                }
                break;
            case KeyCode.Escape:
                this.setState({ menuIndex: -1, showDropDown: false });
                break;
            default:
                hasOperation = false;
        }
        if (hasOperation) {
            e.preventDefault();
        }
    }

    private renderList() {
        const { titleKey } = this.props;
        const { items, menuIndex, showDropDown } = this.state;
        if (!items.length || !showDropDown) { return null; }
        const menuItems = (items || []).map((item, index) => {
            const className = index === menuIndex ? "has-hover" : "";
            return <a className={`list-item ${className}`} onClick={this.onItemSelect} key={index} data-index={index}>{item[titleKey]}</a>;
        });
        return (
            <div className="list-wrapper form-control">
                {menuItems}
            </div>
        );
    }

    private renderSelectedItems() {
        const { multi, titleKey } = this.props;
        if (!multi) { return null; }
        if (!this.selectedItems.length) { return null; }
        const selectedItems = [];
        for (let i = 0, il = this.selectedItems.length; i < il; ++i) {
            selectedItems.push(<span key={i} data-index={i} onClick={this.onItemDelete}>{this.selectedItems[i][titleKey]}</span>);
        }
        return <div className="selected-items">{selectedItems}</div>;
    }

    private selectItemByIndex(index: number) {
        const { titleKey, valueKey, multi, onChange, name } = this.props;
        const { items } = this.state;
        const selectedItem = items[index];
        if (!selectedItem) { return; }
        const term = selectedItem[titleKey];
        const selectedValue = selectedItem[valueKey];
        if (multi) {
            let found = false;
            for (let i = 0, il = this.selectedItems.length; i < il; ++i) {
                if (this.selectedItems[i][valueKey] == selectedItem[valueKey]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.selectedItems.push(selectedItem);
            }
        }
        this.hasStateChanged = true;
        onChange(name, multi ? this.selectedItems.map((item) => item[valueKey]) : selectedValue);
        this.setState({ term: multi ? "" : term, menuIndex: -1, showDropDown: false });
    }
}

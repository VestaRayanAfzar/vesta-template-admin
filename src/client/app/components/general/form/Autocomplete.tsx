import React, {Component} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";
import {Search} from "../../PageComponent";

export interface AutocompleteProps extends BaseComponentProps {
    label: string;
    name: string;
    value?: any;
    search: Search<any>;
    onChange?: ChangeEventHandler;
    error?: string;
    titleKey: string;
    valueKey: string;
    placeholder?: boolean;
}

export interface AutocompleteState {
    term: string;
    items: Array<any>;
    showLoader: boolean;
}

export class Autocomplete extends Component<AutocompleteProps, AutocompleteState> {
    private showDropDown = false;

    constructor(props: AutocompleteProps) {
        super(props);
        this.state = {term: '', items: [], showLoader: false};
    }

    private onChange = (e) => {
        const term = e.target.value;
        this.setState({term});
        if (!term) return;
        this.setState({showLoader: true});
        this.props.search(term)
            .then(items => {
                this.showDropDown = true;
                this.setState({showLoader: false, items});
            })
            .catch(error => {
                this.setState({showLoader: false});
            })
    }

    private onItemSelect = (e) => {
        const {valueKey, titleKey} = this.props;
        let value = e.target.getAttribute('data-value');
        let term = e.target.textContent;
        let numericValue = +value;
        this.showDropDown = false;
        this.props.onChange(this.props.name, {
            [valueKey]: isNaN(numericValue) ? value : numericValue,
            [titleKey]: term
        });
        this.setState({term})
    }

    private renderList() {
        let {titleKey, valueKey} = this.props;
        let {items} = this.state;
        if (!items.length || !this.showDropDown) return null;
        const menuItems = items.map((item, index) => (
            <a className="list-item" onClick={this.onItemSelect} key={index}
               data-value={item[valueKey]}>{item[titleKey]}</a>
        ));
        return (
            <div className="list-wrapper form-control">
                {menuItems}
            </div>
        );
    }

    public render() {
        let {name, label, error, value, titleKey, placeholder} = this.props;
        let {showLoader, term} = this.state;
        let list = this.renderList();
        term = term || (value && value[titleKey]) || '';
        return (
            <div className={`form-group autocomplete-input${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" onChange={this.onChange} value={term}
                       placeholder={placeholder ? label : ''}/>
                {showLoader ? <span>Loading...</span> : null}
                {list}
                <p className="form-error">{error || ''}</p>
            </div>
        )
    }
}
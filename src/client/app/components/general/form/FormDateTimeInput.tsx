import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";
import {Culture} from "../../../cmn/core/Culture";
import {Modal} from "../Modal";
import {DatePicker} from "../DatePicker";

export interface FormDateTimeInputProps extends BaseComponentProps {
    label: string;
    name: string;
    value?: number;
    onChange?: ChangeEventHandler;
    error?: string;
    hasTime?: boolean;
    placeholder?: boolean;
}

export interface FormDateTimeInputState {
    value: string;
    showPicker: boolean;
}

export class FormDateTimeInput extends PureComponent<FormDateTimeInputProps, FormDateTimeInputState> {
    private dateTime = new (Culture.getDateTime());
    private dateTimeFormat = this.props.hasTime ? Culture.getLocale().defaultDateTimeFormat : Culture.getLocale().defaultDateFormat;

    constructor(props: FormDateTimeInputProps) {
        super(props);
        this.state = {value: this.format(), showPicker: false};
    }

    private showPicker = () => {
        this.setState({showPicker: true});
    }

    private hidePicker = () => {
        this.setState({showPicker: false});
    }

    private format(): string {
        let {value} = this.props;
        let timestamp = +value;
        if (!isNaN(timestamp)) {
            this.dateTime.setTime(timestamp);
        }
        return this.dateTime.format(this.dateTimeFormat);
    }

    private onChange = (value) => {
        let {name, onChange} = this.props;
        let timestamp = this.dateTime.validate(value);
        if (timestamp) {
            onChange(name, timestamp);
        }
        this.setState({value, showPicker: false});
    }

    private onInputChange = (e) => {
        let value = e.target.value;
        this.onChange(value);
    }

    public render() {
        let {name, label, error, hasTime, placeholder} = this.props;
        let {value, showPicker} = this.state;

        let picker = showPicker ?
            <Modal show={true} name="modal-zoom">
                <DatePicker value={value} onChange={this.onChange} onAbort={this.hidePicker} hasTime={hasTime}/>
            </Modal> : <Modal show={false} name="modal-zoom"/>;

        return (
            <div className={`form-group date-time-input${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" name={name} id={name} placeholder={placeholder ? label : null}
                       value={value} onChange={this.onInputChange} readOnly={true} onClick={this.showPicker}/>
                <p className="form-error">{error || ''}</p>
                {picker}
            </div>
        )
    }
}
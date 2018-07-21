import React, { PureComponent } from "react";
import { Culture } from "../../../medium";
import { IBaseComponentProps } from "../../BaseComponent";
import { DatePicker } from "../DatePicker";
import { Modal } from "../Modal";
import { IFromControlProps } from "./FormWrapper";

interface IFormDateTimeInputProps extends IBaseComponentProps, IFromControlProps {
    hasTime?: boolean;
    value?: number;
}

interface IFormDateTimeInputState {
    showPicker?: boolean;
    value: string;
}

export class FormDateTimeInput extends PureComponent<IFormDateTimeInputProps, IFormDateTimeInputState> {
    private dateTime = Culture.getDateTimeInstance();
    private dateTimeFormat: string;

    constructor(props: IFormDateTimeInputProps) {
        super(props);
        const locale = Culture.getLocale();
        this.dateTimeFormat = this.props.hasTime ? locale.defaultDateTimeFormat : locale.defaultDateFormat;
        this.state = { value: this.format(props.value) };
    }

    public componentWillReceiveProps(newProps: IFormDateTimeInputProps) {
        const { value } = this.props;
        if (newProps.value !== value) {
            this.setState({ value: this.format(newProps.value) });
        }
    }

    public render() {
        const { name, label, error, hasTime, placeholder } = this.props;
        const { value, showPicker } = this.state;

        const picker = showPicker ? (
            <Modal show={true} name="modal-zoom">
                <DatePicker value={value} onChange={this.onChange} onAbort={this.hidePicker} hasTime={hasTime} />
            </Modal>) : <Modal show={false} name="modal-zoom" />;

        return (
            <div className={`form-group date-time-input${error ? " has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" name={name} id={name} placeholder={placeholder ? label : null}
                    value={value} onChange={this.onInputChange} readOnly={true} onClick={this.showPicker} />
                <p className="form-error">{error || ""}</p>
                {picker}
            </div>
        );
    }

    private format(value: number): string {
        const timestamp = +value;
        if (!isNaN(timestamp)) {
            this.dateTime.setTime(timestamp);
        }
        return this.dateTime.format(this.dateTimeFormat);
    }

    private hidePicker = () => {
        this.setState({ showPicker: false });
    }

    private onChange = (value) => {
        const { name, onChange, hasTime } = this.props;
        // dateTime validation, also sets the correct values
        if (this.dateTime.validate(value, hasTime) && onChange) {
            onChange(name, this.dateTime.getTime());
        }
        this.setState({ value, showPicker: false });
    }

    private onInputChange = (e) => {
        const value = e.target.value;
        this.onChange(value);
    }

    private showPicker = () => {
        this.setState({ showPicker: true });
    }
}

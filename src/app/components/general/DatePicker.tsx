import { Culture, DateTime } from "@vesta/core";
import React, { Component } from "react";
import { IBaseComponentProps } from "../BaseComponent";

export interface IDatePickerProps extends IBaseComponentProps {
    hasTime?: boolean;
    onAbort: () => void;
    onChange: (value: string) => void;
    value: string;
}

export interface IDatePickerState {
}

export class DatePicker extends Component<IDatePickerProps, IDatePickerState> {
    private dateTime: DateTime = Culture.getDateTimeInstance();
    private dateTimeFormat: string;
    private format;
    private monthNames: string[] = [];
    private selectedDateTime = Culture.getDateTimeInstance();
    // the datePicker should render the month in which the selected date exist
    private tr = Culture.getDictionary().translate;
    private weekDayNames: string[] = [];

    constructor(props: IDatePickerProps) {
        super(props);
        const locale = this.dateTime.locale;
        this.dateTimeFormat = props.hasTime ? locale.defaultDateTimeFormat : locale.defaultDateFormat;
        // dateTime validation, also sets the correct values
        if (this.selectedDateTime.validate(props.value, props.hasTime)) {
            this.dateTime.setTime(this.selectedDateTime.getTime());
        } else {
            this.selectedDateTime.setTime(this.dateTime.getTime());
        }
        this.state = {};
        this.format = locale.defaultDateFormat;
        this.weekDayNames = locale.weekDays;
        this.monthNames = locale.monthNames;
    }

    public render() {
        const { onAbort, hasTime } = this.props;
        const time = hasTime ? this.renderTime() : null;
        return (
            <div className="date-picker">
                <div className="picker-wrapper">
                    {this.renderHeader()}
                    <table>
                        <thead>
                            <tr className="week-days-name">
                                {this.renderWeekDaysHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderWeekDays()}
                        </tbody>
                    </table>
                    {time}
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary"
                            onClick={this.onSubmit}>{this.tr("select")}</button>
                        <button type="button" className="btn btn-outline"
                            onClick={onAbort}>{this.tr("cancel")}</button>
                        <button type="button" className="btn btn-outline"
                            onClick={this.onClear}>{this.tr("clear")}</button>
                    </div>
                </div>
            </div>
        );
    }

    private nextMonth = () => {
        this.dateTime.setMonth(this.dateTime.getMonth() + 1);
        this.forceUpdate();
    }

    private prevMonth = () => {
        this.dateTime.setMonth(this.dateTime.getMonth() - 1);
        this.forceUpdate();
    }
    private nextYear = () => {
        this.dateTime.setFullYear(this.dateTime.getFullYear() + 1);
        this.forceUpdate();
    }

    private prevYear = () => {
        this.dateTime.setFullYear(this.dateTime.getFullYear() - 1);
        this.forceUpdate();
    }

    private onYearSelect = () => {
        // tslint
    }

    private onMonthSelect = () => {
        // tslint
    }

    private onDaySelect = (e) => {
        // this.dateTime holds the current month & year
        this.dateTime.setDate(+e.currentTarget.textContent);
        this.selectedDateTime.setTime(this.dateTime.getTime());
        this.forceUpdate();
    }

    private onHourSelect = (e) => {
        const hour = +e.target.value;
        // this.dateTime.setHours(hour);
        this.selectedDateTime.setHours(hour);
        this.forceUpdate();
    }

    private onMinSelect = (e) => {
        const minute = +e.target.value;
        // this.dateTime.setMinutes(minute);
        this.selectedDateTime.setMinutes(minute);
        this.forceUpdate();
    }

    private onSubmit = () => {
        this.props.onChange(this.selectedDateTime.format(this.dateTimeFormat));
    }

    private onClear = () => {
        this.props.onChange("");
    }

    private renderHeader() {
        return (
            <header>
                <div className="month-year-row">
                    <div className="month-select">
                        <a onClick={this.prevMonth}>&lt;</a>
                        <h2>{this.monthNames[this.dateTime.getMonth()]}</h2>
                        <a onClick={this.nextMonth}>&gt;</a>
                    </div>
                    <div className="year-select">
                        <a onClick={this.prevYear}>&lt;</a>
                        <h2>{this.dateTime.getFullYear()}</h2>
                        <a onClick={this.nextYear}>&gt;</a>
                    </div>
                </div>
            </header>
        );
    }

    private renderWeekDaysHeader() {
        const row = [];
        const weekDays = this.dateTime.locale.weekDaysShort;
        for (let i = 0; i < 7; ++i) {
            row.push(<th key={i}>{weekDays[i]}</th>);
        }
        return row;
    }

    private renderWeekDays() {
        const tmpDate = Culture.getDateTimeInstance();
        const isThisMonth = tmpDate.getFullYear() === this.dateTime.getFullYear() &&
            tmpDate.getMonth() === this.dateTime.getMonth();
        const today = tmpDate.getDate();
        //
        tmpDate.setFullYear(this.dateTime.getFullYear(), this.dateTime.getMonth(), 1);
        const isSelectedMonth = this.selectedDateTime.getFullYear() === this.dateTime.getFullYear() &&
            this.selectedDateTime.getMonth() === this.dateTime.getMonth();
        const selectedDay = this.selectedDateTime.getDate();
        const rows = [];
        let rowCounter = 1;
        let colCounter = 0;
        const daysInMonth = this.dateTime.locale.daysInMonth[this.dateTime.getMonth()];
        let row = [];
        // get weekDay first day of month
        const firstWeekDayOfMonth = tmpDate.getDay();
        // first row
        for (let i = 0; i < firstWeekDayOfMonth; ++i) {
            row.push(<td key={colCounter}>&nbsp;</td>);
            ++colCounter;
        }
        for (let i = 1; i <= daysInMonth; i++) {
            let className = isThisMonth && i == today ? "today" : "";
            className = `${className} ${isSelectedMonth && i == selectedDay ? "selected" : ""}`;
            row.push(<td key={colCounter} className={className} onClick={this.onDaySelect}><i>{i}</i></td>);
            ++colCounter;
            if (colCounter % 7 == 0) {
                rows.push(<tr key={rowCounter++}>{row}</tr>);
                row = [];
            }
        }
        // next month remaining cell
        if (colCounter % 7) {
            for (let i = colCounter % 7; i < 7; ++i) {
                row.push(<td key={colCounter++}>&nbsp;</td>);
            }
        }
        if (row.length) {
            rows.push(<tr key={rowCounter}>{row}</tr>);
        }
        return rows;
    }

    private renderTime() {
        const hour = this.selectedDateTime.getHours();
        const minute = this.selectedDateTime.getMinutes();
        const hourSelect = [];
        for (let i = 0; i <= 23; ++i) {
            hourSelect.push(<option value={i} key={i}>{i}</option>);
        }
        const minSelect = [];
        for (let i = 0; i <= 59; ++i) {
            minSelect.push(<option value={i} key={i}>{i}</option>);
        }
        return (
            <div className="time-select">
                <div className="hour-select">
                    <label>{this.tr("hour")}</label>
                    <select className="form-control" value={hour} onChange={this.onHourSelect}>{hourSelect}</select>
                </div>
                <div className="min-select">
                    <select className="form-control" value={minute} onChange={this.onMinSelect}>{minSelect}</select>
                    <label>{this.tr("minute")}</label>
                </div>
            </div>
        );
    }
}

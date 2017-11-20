import React, {Component} from "react";
import {BaseComponentProps} from "../BaseComponent";
import {Culture} from "../../cmn/core/Culture";
import {DateTime} from "../../cmn/core/DateTime";
import {TranslateService} from "../../service/TranslateService";

export interface DatePickerProps extends BaseComponentProps {
    value: string;
    onChange: (value: string) => void;
    onAbort: () => void;
    hasTime?: boolean;
}

export interface DatePickerState {
}

export class DatePicker extends Component<DatePickerProps, DatePickerState> {
    private dateTime: DateTime = Culture.getDateTimeInstance();
    private selectedDateTime = Culture.getDateTimeInstance();
    private dateTimeFormat = this.props.hasTime ? Culture.getLocale().defaultDateTimeFormat : Culture.getLocale().defaultDateFormat;
    private format;
    private weekDayNames: Array<string> = [];
    private monthNames: Array<string> = [];
    private tr = TranslateService.getInstance().translate;
    private monthTimer;
    private yearTimer;
    private defaultRenderTimeout = 200;

    constructor(props: DatePickerProps) {
        super(props);
        let timestamp = this.dateTime.validate(props.value);
        if (timestamp) {
            this.dateTime.setTime(timestamp);
            this.selectedDateTime.setTime(timestamp);
        }
        this.state = {};
        let locale = this.dateTime.locale;
        this.format = locale.defaultDateFormat;
        this.weekDayNames = locale.weekDays;
        this.monthNames = locale.monthNames;
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
    }

    private onMonthSelect = () => {
    }

    private onDaySelect = (e) => {
        this.dateTime.setDate(+e.currentTarget.textContent);
        this.selectedDateTime.setTime(this.dateTime.getTime());
        this.forceUpdate();
    }

    private onHourSelect = (e) => {
        let hour = +e.target.value;
        this.dateTime.setHours(hour);
        this.selectedDateTime.setHours(hour);
        this.forceUpdate();
    }

    private onMinSelect = (e) => {
        let minute = +e.target.value;
        this.dateTime.setMinutes(minute);
        this.selectedDateTime.setMinutes(minute);
        this.forceUpdate();
    }

    private onSubmit = () => {
        this.props.onChange(this.selectedDateTime.format(this.dateTimeFormat));
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
        let row = [];
        let weekDays = this.dateTime.locale.weekDaysShort;
        for (let i = 0; i < 7; ++i) {
            row.push(<th key={i}>{weekDays[i]}</th>);
        }
        return row;
    }

    private renderWeekDays() {
        let tmpDate = Culture.getDateTimeInstance();
        const isThisMonth = tmpDate.getFullYear() === this.dateTime.getFullYear() && tmpDate.getMonth() === this.dateTime.getMonth();
        const today = tmpDate.getDate();
        tmpDate.setFullYear(this.dateTime.getFullYear(), this.dateTime.getMonth(), 1);
        const isSelectedMonth = this.selectedDateTime.getFullYear() === this.dateTime.getFullYear() && this.selectedDateTime.getMonth() === this.dateTime.getMonth();
        let rows = [];
        let rowCounter = 1;
        let colCounter = 0;
        let daysInMonth = this.dateTime.locale.daysInMonth[this.dateTime.getMonth()];
        let row = [];
        // get weekDay first day of month
        let firstWeekDayOfMonth = tmpDate.getDay();
        // first row
        for (let i = 0; i < firstWeekDayOfMonth; ++i) {
            row.push(<td key={colCounter}>&nbsp;</td>);
            ++colCounter;
        }
        for (let i = 1; i <= daysInMonth; i++) {
            let className = isThisMonth && i == today ? 'today' : '';
            className = `${className}${isSelectedMonth && i == this.selectedDateTime.getDate() ? ' selected' : ''}`
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
        const hour = this.dateTime.getHours();
        const minute = this.dateTime.getMinutes();
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
                    <label>{this.tr('hour')}</label>
                    <select className="form-control" value={hour} onChange={this.onHourSelect}>{hourSelect}</select>
                </div>
                <div className="min-select">
                    <select className="form-control" value={minute} onChange={this.onMinSelect}>{minSelect}</select>
                    <label>{this.tr('minute')}</label>
                </div>
            </div>
        );
    }

    public render() {
        const {onAbort, hasTime} = this.props;
        const time = hasTime ? this.renderTime() : null;
        return (
            <div className="date-picker">
                <div className="picker-wrapper">
                    {this.renderHeader()}
                    <table>
                        <thead>
                        <tr className='week-days-name'>
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
                                onClick={this.onSubmit}>{this.tr('select')}</button>
                        <button type="button" className="btn btn-default" onClick={onAbort}>{this.tr('cancel')}</button>
                    </div>
                </div>
            </div>
        );
    }
}

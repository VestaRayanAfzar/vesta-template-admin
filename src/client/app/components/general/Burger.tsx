import * as React from "react";
import {PureComponent} from "react";
import {Dispatcher} from "../../service/Dispatcher";
import {BaseComponentProps} from "../BaseComponent";

export interface BurgerProps extends BaseComponentProps {
    event?: string;
    className?: string;
    onClick?: (e) => void;
}

export interface BurgerState {
}

export class Burger extends PureComponent<BurgerProps, BurgerState> {
    private dispatch = Dispatcher.getInstance().dispatch;

    private onClick = (e) => {
        const {event, onClick} = this.props;
        if (event) {
            return this.dispatch(event, {});
        }
        if (onClick) {
            onClick(e);
        }
    }

    public render() {
        const {className} = this.props;

        return (
            <a className={`burger-component${className ? ` ${className}` : ''}`} onClick={this.onClick}>
                <span></span>
                <span></span>
                <span></span>
            </a>
        )
    }
}
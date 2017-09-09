import * as React from "react";
import {Dispatcher} from "../../service/Dispatcher";

export interface BurgerProps {
    event: string;
    className?: string;
}

export const Burger = (props: BurgerProps) => {
    let className = "burger-component";
    if (props.className) className += ` ${props.className}`;
    return (
        <a className={className} onClick={clickHandler}>
            <span></span>
            <span></span>
            <span></span>
        </a>
    );

    function clickHandler() {
        Dispatcher.getInstance().dispatch(props.event, {});
    }
};
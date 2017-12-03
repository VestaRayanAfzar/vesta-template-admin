import React from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface IconProps extends BaseComponentProps {
    name: string;
    size?: string;
    onClick?: (e) => void;
}

export const Icon = (props: IconProps) => {
    const {name, size, onClick} = props;
    let sizeClass = size ? ` size-${size}` : '';
    return (
        <span className={`icon${sizeClass}`} onClick={onClick}>{name}</span>
    )
};
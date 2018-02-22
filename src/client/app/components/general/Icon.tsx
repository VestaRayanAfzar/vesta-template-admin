import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../BaseComponent";

export interface IconProps extends IBaseComponentProps {
    name: string;
    onClick?: (e) => void;
    size?: string;
}

export class Icon extends PureComponent<IconProps, null>{

    public render() {
        const { name, size, onClick } = this.props;
        let sizeClass = size ? `size-${size}` : '';

        return (
            <span className={`icon ${sizeClass}`} onClick={onClick}>{name}</span>
        );
    }
};
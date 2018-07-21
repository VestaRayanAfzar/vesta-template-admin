import React from "react";
import { IBaseComponentProps } from "../../BaseComponent";

interface IFormErrorProps extends IBaseComponentProps {
    error: string;
}

export const FormError = (props: IFormErrorProps) => {
    if (!props.error) {
        return null;
    }
    return <p className="formError-component">{props.error}</p>;
};

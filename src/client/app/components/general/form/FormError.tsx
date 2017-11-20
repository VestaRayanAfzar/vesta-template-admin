import React from "react";
import {BaseComponentProps} from "../../BaseComponent";

export interface FormErrorProps extends BaseComponentProps {
    error: string;
}

export const FormError = (props: FormErrorProps) => {
    if (!props.error) return null;
    return <p className="formError-component">{props.error}</p>;
};


import React from "react";
import {PageComponentProps} from "../../PageComponent";

export interface FormErrorParams {
}

export interface FormErrorProps extends PageComponentProps<FormErrorParams> {
    error: string;
}

export const FormError = (props: FormErrorProps) => {
    if (!props.error) return null;
    return <p className="formError-component">{props.error}</p>;
};


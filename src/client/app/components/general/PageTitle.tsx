import React from "react";
import {PageComponentProps} from "../PageComponent";

export interface PageTitleParams {
}

export interface PageTitleProps extends PageComponentProps<PageTitleParams> {
    title: string;
    append?: boolean;
}
let baseTitle = document.title;

export const PageTitle = (props: PageTitleProps) => {
    document.title = 'append' in props && !props.append ? props.title : `${props.title}, ${baseTitle}`;
    return null;
};
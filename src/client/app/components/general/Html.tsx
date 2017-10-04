import * as React from "react";
import {PageComponentProps} from "../PageComponent";

export interface HtmlParams {
}

export interface HtmlProps extends PageComponentProps<HtmlParams> {
    lang: string;
    dir: string;
}

export const Html = (props: HtmlProps) => {
    document.documentElement.setAttribute('lang', props.lang);
    document.documentElement.setAttribute('dir', props.dir);
    return null;
};
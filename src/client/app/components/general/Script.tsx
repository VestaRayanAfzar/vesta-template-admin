import * as React from "react";
import {PageComponentProps} from "../PageComponent";

export interface ScriptParams {
}

export interface ScriptProps extends PageComponentProps<ScriptParams> {
    src: string;
    success: () => void;
    error?: () => void;
}

export const Script = (props: ScriptProps) => {
    const src = props.src;
    if (!src) return null;
    let head = document.documentElement.querySelector('head');
    let script = document.createElement('script');
    script.setAttribute('src', src);
    script.addEventListener('load', () => {
        props.success();
    })
    head.appendChild(script);
    return null;
};
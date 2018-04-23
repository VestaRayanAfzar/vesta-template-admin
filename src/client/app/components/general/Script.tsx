import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../BaseComponent";

export interface IScriptProps extends IBaseComponentProps {
    src: string;
    success: () => void;
    error?: () => void;
}

export class Script extends PureComponent<IScriptProps, null> {

    public render() {
        const { src, error, success } = this.props;
        if (!src) { return null; }
        const head = document.documentElement.querySelector("head");
        const script = document.createElement("script");
        script.setAttribute("src", src);
        script.addEventListener("load", success);
        head.appendChild(script);
        return null;
    }
}

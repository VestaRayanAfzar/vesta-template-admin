import React, {EventHandler} from "react";
import {PageComponentProps} from "../PageComponent";
import {Dialog} from "./Dialog";

export const enum PreloaderType {Circular = 1}

export interface PreloaderOptions {
    modal?: boolean;
    type?: PreloaderType;
    show?: boolean;
    message?: string;
    close?: EventHandler<any>;
}

export interface PreloaderParams {
}

export interface PreloaderProps extends PageComponentProps<PreloaderParams> {
    options: PreloaderOptions;
}

export const Preloader = (props: PreloaderProps) => {
    const options = props.options;

    return options.show ?
        <Dialog options={{close: options.close, modal: true}}>
            <div className="preloader-component">
                {renderPreloader()}
            </div>
        </Dialog> : null;

    function renderPreloader() {
        return <div>
            <h2>Operation in progress...</h2>
            <h3>please wait!</h3>
            {options.message ? <p>{options.message}</p> : null}
        </div>
    }
};
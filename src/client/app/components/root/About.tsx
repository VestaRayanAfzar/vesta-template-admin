import * as React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface AboutParams {
}

export interface AboutProps extends PageComponentProps<AboutParams> {
}

export interface AboutState extends PageComponentState {
}

export class About extends PageComponent<AboutProps, AboutState> {

    public render() {
        return (
            <div className="page"><h1>About Component</h1></div>
        );
    }
}
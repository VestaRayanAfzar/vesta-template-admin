import * as React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";

export interface HomeParams {
}

export interface HomeProps extends PageComponentProps<HomeParams> {
}

export interface HomeState extends PageComponentState {
}

export class Home extends PageComponent<HomeProps, HomeState> {

    public render() {
        return (
            <div className="page"><h1>Home Component</h1></div>
        );
    }
}

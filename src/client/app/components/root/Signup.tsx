import * as React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";

export interface SignupParams {
}

export interface SignupProps extends PageComponentProps<SignupParams> {
}

export interface SignupState extends PageComponentState {
}

export class Signup extends PageComponent<SignupProps, SignupState> {

    public render() {
        return (
            <div><h1>Signup Component</h1></div>
        );
    }
}

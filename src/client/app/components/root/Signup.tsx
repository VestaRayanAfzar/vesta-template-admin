import React from "react";
import {PageComponent} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface SignupProps {
}

export interface SignupState {
}

export class Signup extends PageComponent<SignupProps, SignupState> {

    public render() {
        return (
            <div><h1>Signup Component</h1></div>
        );
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }
}

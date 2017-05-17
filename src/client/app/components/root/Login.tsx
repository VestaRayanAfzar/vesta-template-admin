import React from "react";
import {AuthService} from "../../service/AuthService";
import {PageComponent} from "../PageComponent";

export interface LoginProps {
}

export interface LoginState {
}

export class Login extends PageComponent<LoginProps, LoginState> {


    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }

    public render() {
        return (
            <div><h1>Login Component</h1></div>
        );
    }
}

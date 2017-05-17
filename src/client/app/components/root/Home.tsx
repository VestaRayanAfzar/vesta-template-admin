import React from "react";
import {PageComponent} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface HomeProps {
}

export interface HomeState {
}

export class Home extends PageComponent<HomeProps, HomeState> {

    public render() {
        return (
            <div className="page"><h1>Home Component</h1></div>
        );
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }
}

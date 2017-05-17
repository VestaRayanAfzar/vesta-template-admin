import React from "react";
import {PageComponent} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface AboutProps {
}

export interface AboutState {
}

export class About extends PageComponent<AboutProps, AboutState> {

    public render() {
        return (
            <div className="page"><h1>About Component</h1></div>
        );
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }
}
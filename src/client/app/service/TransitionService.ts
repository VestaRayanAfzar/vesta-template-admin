import React, {Attributes, ComponentClass, ReactNode} from "react";
import {Forbidden} from "../components/root/Forbidden";
import {AuthService, IPermissionCollection} from "./AuthService";

export class TransitionService {
    private static instance: TransitionService;
    private idCounter = 1;

    constructor(private auth: AuthService) {
    }

    public willTransitionTo(componentClass: ComponentClass<any>, permissions?: IPermissionCollection, extraProps?: Attributes & any, children?: Array<ReactNode>) {
        let id = this.idCounter++;
        if (permissions) {
            this.auth.registerPermissions(id, permissions);
        }
        extraProps = extraProps || {};
        return (props) => {
            return this.auth.hasAccessToState(id) ?
                React.createElement(componentClass, {...props, ...extraProps}, children) :
                React.createElement(Forbidden, props);
        }
    }

    public static getInstance(auth: AuthService = AuthService.getInstance()): TransitionService {
        if (!TransitionService.instance) {
            TransitionService.instance = new TransitionService(auth);
        }
        return TransitionService.instance;
    }
}
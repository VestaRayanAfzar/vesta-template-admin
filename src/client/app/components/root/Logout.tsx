import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {AuthService} from "../../service/AuthService";
import {IUser} from "../../cmn/models/User";

export interface LogoutParams {
}

export interface LogoutProps extends PageComponentProps<LogoutParams> {
}

export interface LogoutState extends PageComponentState {
}

export class Logout extends PageComponent<LogoutProps, LogoutState> {
    private auth: AuthService = AuthService.getInstance();

    public componentDidMount() {
        if (this.auth.isGuest()) {
            return this.props.history.push('/');
        }
        this.api.get<IUser>('account/logout')
            .then(response => {
                    this.auth.login(response.items[0]);
                    this.props.history.push('/login');
            })
            .catch(err => {
                this.notif.error(err.message);
            });
    }

    public render() {
        return null;
    }
}

import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IQueryResult} from "../../medium";
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
            return this.props.history.push('/login');
        }
        this.api.get<IQueryResult<IUser>>('account/logout')
            .then(response => {
                if (response) {
                    this.auth.login(response.items[0]);
                    this.props.history.push('/login');
                } else {
                    this.notification.error('Something goes wrong! Please try again');
                }
            })
            .catch(err => {
                this.notification.error(err.message);
            });
    }

    public render() {
        return (
            <div className="page logout-component">
                <h1>Logout in progress...</h1>
            </div>
        )
    }
}

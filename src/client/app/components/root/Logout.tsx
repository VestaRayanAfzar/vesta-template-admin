import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IUser} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";

export interface LogoutParams {
}

export interface LogoutProps extends PageComponentProps<LogoutParams> {
}

export interface LogoutState extends PageComponentState {
}

export class Logout extends PageComponent<LogoutProps, LogoutState> {

    private onAfterLogout() {
        this.auth.logout();
    }

    public componentDidMount() {
        if (this.auth.isGuest()) {
            return this.props.history.push('/');
        }

        this.api.get<IUser>('account/logout')
            .then(response => {
                this.onAfterLogout();
                this.auth.login(response.items[0]);
                this.props.history.push('/login');
            })
            .catch(err => {
                this.props.history.push('/login');
                this.notif.error(err.message);
            });
    }

    public render() {
        return <Preloader show={true}/>;
    }
}

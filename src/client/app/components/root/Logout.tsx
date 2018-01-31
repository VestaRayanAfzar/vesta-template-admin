import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IUser} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {LogService} from "../../service/LogService";

export interface LogoutParams {
}

export interface LogoutProps extends PageComponentProps<LogoutParams> {
}

export interface LogoutState extends PageComponentState {
}

export class Logout extends PageComponent<LogoutProps, LogoutState> {

    private onAfterLogout(user: IUser) {
        this.auth.logout();
        this.auth.login(user);
        this.props.history.replace('/');
    }

    public componentDidMount() {
        if (this.auth.isGuest()) {
            return this.props.history.replace('/');
        }

        this.api.get<IUser>('account/logout')
            .then(response => {
                this.onAfterLogout(response.items[0]);
            })
            .catch(error => {
                LogService.error(error, 'componentDidMount', 'Logout');
                this.onAfterLogout({});
            });
    }

    public render() {
        return <Preloader show={true}/>;
    }
}

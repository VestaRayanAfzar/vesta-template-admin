import React from "react";
import ReactRouterDOM from "react-router-dom";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {Dispatcher} from "../service/Dispatcher";
import {IUser, User} from "../cmn/models/User";
import {IQueryResult} from "vesta-lib";

export interface RootProps {
}

interface RootState {
    user?: IUser;
}

export class Root extends React.Component<RootProps, RootState> {
    private apiService = ApiService.getInstance();
    private authService = AuthService.getInstance();

    constructor(props: RootProps) {
        super(props);
        this.state = {user: new User()};
    }

    componentWillMount() {
        Dispatcher.getInstance().register(AuthService.Events.Update, (payload) => {
            this.setState({user: payload.user});
        });
        this.apiService.get<any, IQueryResult<IUser>>('me')
            .then(response => {
                this.authService.login(response.items[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }

    static willTransitionTo(transition) {
        console.log(transition);
    }

    render() {
        let {Link} = ReactRouterDOM;
        return (
            <div id="main-wrapper">
                <header id="main-header">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                </header>
                <main id="main-content">
                    <div id="content-wrapper">
                        {this.props.children}
                        <footer id="main-footer">FOOTER</footer>
                    </div>
                </main>
            </div>
        );
    }
}

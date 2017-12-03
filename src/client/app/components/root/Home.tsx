import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {Dispatcher} from "../../service/Dispatcher";
import {AuthService} from "../../service/AuthService";
import {Preloader} from "../general/Preloader";
import {IUser} from "../../cmn/models/User";

export interface HomeParams {
}

export interface HomeProps extends PageComponentProps<HomeParams> {
}

export interface HomeState extends PageComponentState {
    onHold: boolean;
}

export class Home extends PageComponent<HomeProps, HomeState> {
    private dispatcher = Dispatcher.getInstance();

    constructor(props: HomeProps) {
        super(props);
        this.state = {onHold: false};
    }

    public componentDidMount() {
        const user = this.auth.getUser();
        if (!Object.keys(user).length) {
            // no user data available; wait until login
            this.setState({onHold: true});
            return this.dispatcher.register<IUser>(AuthService.Events.Update, (user) => {
                this.setState({onHold: false});
            });
        }
        if (this.auth.isGuest()) {
            this.props.history.push('/login');
        }
    }

    public render() {
        const {onHold} = this.state;
        return (
            <div className="page home-page has-navbar">
                <Navbar title={this.tr('home')} showBurger={true}/>
                <h1>Home Component</h1>
                <Preloader show={onHold} subTitle={this.tr('msg_receive_data')}/>
            </div>
        );
    }
}

import * as React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";

export interface HomeParams {
}

export interface HomeProps extends PageComponentProps<HomeParams> {
}

export interface HomeState extends PageComponentState {
}

export class Home extends PageComponent<HomeProps, HomeState> {

    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }

    public componentWillMount() {
        if (this.auth.isGuest()) {
            this.props.history.push('/login');
        }
    }

    public render() {
        return (
            <div className="page home-page has-navbar">
                <Navbar title={this.tr('home')} showBurger={true}/>
                <h1>Home Component</h1>
            </div>
        );
    }
}

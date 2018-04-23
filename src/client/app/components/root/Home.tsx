import React from "react";
import Navbar from "../general/Navbar";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface IHomeParams {
}

interface IHomeProps extends IPageComponentProps<IHomeParams> {
}

interface IHomeState {
}

export class Home extends PageComponent<IHomeProps, IHomeState> {

    constructor(props: IHomeProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div className="page home-page has-navbar">
                <Navbar title={this.tr("home")} showBurger={true} />
                <h1>Home Component</h1>
            </div>
        );
    }
}

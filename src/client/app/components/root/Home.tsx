import * as React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";

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

    public render() {
        return (
            <div className="page">
                <h1>Home Component</h1>
                <br/>
                <Link to='/about'>About</Link>
            </div>
        );
    }
}

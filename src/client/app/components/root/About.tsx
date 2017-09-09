import * as React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";

export interface AboutParams {
}

export interface AboutProps extends PageComponentProps<AboutParams> {
}

export interface AboutState extends PageComponentState {
}

export class About extends PageComponent<AboutProps, AboutState> {

    constructor(props: AboutProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div className="page">
                <h1>About Component</h1>
                <br/>
                <Link to='/'>Home</Link>
            </div>
        );
    }
}
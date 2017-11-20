import React, {PureComponent} from "react";
import {NavLink} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";
import Navbar from "../general/Navbar";

export interface ForbiddenParams {
}

export interface ForbiddenProps extends PageComponentProps<ForbiddenParams> {
}

export interface ForbiddenState {
    isOnline: boolean;
}

export class Forbidden extends PureComponent<ForbiddenProps, ForbiddenState> {

    constructor(props: ForbiddenProps) {
        super(props);
        this.state = {isOnline: false};
    }

    public componentDidMount() {
        // check for internet connection
        //<cordova>
        // NetworkPlugin.isOnline();
        //</cordova>
    }

    private goBack = () => {
        if (this.props.history.length) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }

    private reload = () => {
        window.location.reload(true);
    }

    public render() {
        return (
            <div className="forbidden-page page has-navbar">
                <Navbar backAction={this.goBack}/>
                <div className="dir-ltr">
                    <h1>Forbidden!</h1>
                    <section>
                        <h3>OOPS! This could happen because of one of the following reasons:</h3>
                        <ul>
                            <li>The internet connection is down and your roles can't be updated</li>
                            <li>You wanted to enter a page that you did not have enough privileges</li>
                        </ul>
                    </section>
                    <div className="tab-header stick-btm">
                        <button className="btn btn-primary" onClick={this.reload}>Reload</button>
                        <NavLink className="btn btn-secondary" to="/">Home</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}

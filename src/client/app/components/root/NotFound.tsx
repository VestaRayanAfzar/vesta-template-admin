import React, {PureComponent} from "react";
import {NavLink} from "react-router-dom";
import Navbar from "../general/Navbar";
import {PageComponentProps} from "../PageComponent";

export interface NotFoundParams {
}

export interface NotFoundProps extends PageComponentProps<NotFoundParams> {
}

export class NotFound extends PureComponent<NotFoundProps, null> {

    private goBack = () => {
        if (this.props.history.length) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/');
        }
    }

    public render() {
        return (
            <div className="notFound-page page has-navbar forbidden-page">
                <Navbar backAction={this.goBack}/>
                <div className="dir-ltr">
                    <h1>Not Found!</h1>
                    <section>
                        <h3>OOPS! The page you are looking for was not found</h3>
                        <p>
                            It is possible that your session has expired, so you don't have access to this page. <br/>
                            You may use the back button on navigation bar or any of the following buttons.
                        </p>
                    </section>
                    <div className="tab-header stick-btm">
                        <button className="btn btn-primary" onClick={this.goBack}>Go Back</button>
                        <NavLink className="btn btn-secondary" to="/">Home</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}
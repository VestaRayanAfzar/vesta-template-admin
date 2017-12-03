import React, {PureComponent} from "react";
import {NavLink} from "react-router-dom";
import {PageComponentProps} from "../PageComponent";

export interface NotFoundParams {
}

export interface NotFoundProps extends PageComponentProps<NotFoundParams> {
}

export class NotFound extends PureComponent<NotFoundProps, null> {

    public componentDidMount() {
        this.props.history.replace('/');
    }

    public render() {
        return (
            <div className="notFound-page page has-navbar forbidden-page"/>
        );
    }
}
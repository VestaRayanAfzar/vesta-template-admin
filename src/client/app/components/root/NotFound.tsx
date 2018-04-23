import React, { PureComponent } from "react";
import { IPageComponentProps } from "../PageComponent";

interface INotFoundParams {
}

interface INotFoundProps extends IPageComponentProps<INotFoundParams> {
}

export class NotFound extends PureComponent<INotFoundProps, null> {

    public componentDidMount() {
        this.props.history.replace("/");
    }

    public render() {
        return (
            <div className="notFound-page page has-navbar" />
        );
    }
}
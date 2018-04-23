import React, { PureComponent } from "react";
import { IPageComponentProps } from "../PageComponent";

interface IForbiddenParams {
}

interface IForbiddenProps extends IPageComponentProps<IForbiddenParams> {
}

interface IForbiddenState {
}

export class Forbidden extends PureComponent<IForbiddenProps, IForbiddenState> {

    public componentDidMount() {
        this.props.history.replace("/");
    }

    public render() {
        return (
            <div className="forbidden-page page has-navbar" />
        );
    }
}

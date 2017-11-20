import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface PageTitleProps extends BaseComponentProps {
    title: string;
    append?: boolean;
}


export class PageTitle extends PureComponent<PageTitleProps, null> {
    private static baseTitle = document.title;

    public componentDidMount() {
        let {title, append} = this.props;
        document.title = append ? `${title}, ${PageTitle.baseTitle}` : title;
    }

    public render() {
        return null;
    }
}
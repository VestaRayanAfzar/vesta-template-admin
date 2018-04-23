import * as React from "react";
import { PureComponent } from "react";

export interface IHtmlProps {
    lang: string;
    dir: string;
}

export class Html extends PureComponent<IHtmlProps, null> {

    public componentDidMount() {
        const { lang, dir } = this.props;
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", dir);
    }

    public render() {
        return null;
    }
}

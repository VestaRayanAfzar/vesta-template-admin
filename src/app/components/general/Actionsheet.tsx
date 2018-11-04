import React, { PureComponent } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Config } from "../../service/Config";
import { IBaseComponentProps } from "../BaseComponent";

export interface IActionsheetItem {
    onClick: () => void;
    title: string;
    value?: string;
}

interface IActionsheetProps extends IBaseComponentProps {
    actions: IActionsheetItem[];
    show: boolean;
}

export class Actionsheet extends PureComponent<IActionsheetProps, null> {
    private transTime = Config.getConfig().transition;

    constructor(props: IActionsheetProps) {
        super(props);
    }

    public render() {
        const { enter, leave } = this.transTime;
        const actionsList = this.renderActionsList();

        return (
            <ReactCSSTransitionGroup transitionName="actionsheet"
                transitionEnterTimeout={enter / 2} transitionLeaveTimeout={leave / 2}>
                {actionsList}
            </ReactCSSTransitionGroup>
        );
    }

    private renderActionsList() {
        if (!this.props.show) { return null; }
        const items = this.props.actions.map((item, index) => (
            <li onClick={item.onClick} data-value={item.value} key={index}>{item.title}</li>
        ));

        return (
            <div className="actionsheet-component">
                <div className="actionsheet-backdrop">&nbsp;</div>
                <ul className="action-list">{items}</ul>
            </div>
        );
    }
}

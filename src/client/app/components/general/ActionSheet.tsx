import React, { PureComponent } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { ConfigService } from "../../service/ConfigService";
import { IBaseComponentProps } from "../BaseComponent";

export interface IActionSheetItem {
    onClick: () => void;
    title: string;
    value?: string;
}

interface IActionSheetProps extends IBaseComponentProps {
    actions: Array<IActionSheetItem>;
    show: boolean;
}

export class ActionSheet extends PureComponent<IActionSheetProps, null> {
    private transTime = ConfigService.getConfig().transition;

    constructor(props: IActionSheetProps) {
        super(props);
    }

    public render() {
        const { enter, leave } = this.transTime;
        const actionsList = this.renderActionsList();

        return (
            <ReactCSSTransitionGroup transitionName="actionsheet" transitionEnterTimeout={enter / 2} transitionLeaveTimeout={leave / 2}>
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

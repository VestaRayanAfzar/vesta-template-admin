import React, {PureComponent} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {BaseComponentProps} from "../BaseComponent";
import {ConfigService} from "../../service/ConfigService";

export interface IActionSheetItem {
    onClick: () => void;
    title: string;
    value?: string;
}

export interface ActionSheetProps extends BaseComponentProps {
    actions: Array<IActionSheetItem>;
    show: boolean;
}

export class ActionSheet extends PureComponent<ActionSheetProps, null> {
    private transTime = ConfigService.getConfig().transition;

    constructor(props: ActionSheetProps) {
        super(props);
    }

    private onSelectAction = () => {
    }

    private renderActionsList() {
        if (!this.props.show) return null;
        const items = this.props.actions.map((item, index) => (
            <li onClick={item.onClick} data-value={item.value} key={index}>{item.title}</li>
        ));
        return (
            <div className="actionSheet-component">
                <div className="actionSheet-backdrop">&nbsp;</div>
                <ul className="action-list">{items}</ul>
            </div>
        )
    }

    public render() {
        let {enter, leave} = this.transTime;
        const actionsList = this.renderActionsList();

        return (
            <ReactCSSTransitionGroup transitionName="actionSheet" transitionEnterTimeout={enter / 2}
                                     transitionLeaveTimeout={leave / 2}>
                {actionsList}
            </ReactCSSTransitionGroup>
        )
    }
}

import React, {PureComponent} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {BaseComponentProps} from "../BaseComponent";
import {ConfigService} from "../../service/ConfigService";

export interface ModalProps extends BaseComponentProps {
    show: boolean;
    name?: string;
    className?: string;
    onClick?: (e) => void;
}

export class Modal extends PureComponent<ModalProps, null> {
    static count = 0;
    // because of this property, this component can not be stateless
    private isOpen = false;
    private transTime = ConfigService.getConfig().transition;

    private updateStatus(show: boolean) {
        if (show) {
            if (!this.isOpen) {
                this.isOpen = true;
                ++Modal.count;
            }
        } else {
            if (this.isOpen) {
                this.isOpen = false;
                --Modal.count;
            }
        }
        if (Modal.count == 1) document.documentElement.classList.add('modal-open');
        else if (!Modal.count) document.documentElement.classList.remove('modal-open');
    }

    public componentWillUnmount() {
        this.updateStatus(false);
    }

    private onModalClicked = (e) => {
        const {onClick} = this.props;
        if (onClick) {
            e.stopPropagation();
            onClick(e);
        }
    }

    public render() {
        let {name, show, children, className} = this.props;
        let {enter, leave} = this.transTime;
        this.updateStatus(show);
        let content = show ?
            <div className={`modal ${className}`} onClick={this.onModalClicked}>
                {children}
            </div> : null;

        return (
            <ReactCSSTransitionGroup transitionName={name || "modal"} transitionEnterTimeout={enter}
                                     transitionLeaveTimeout={leave}>
                {content}
            </ReactCSSTransitionGroup>
        )
    }
}
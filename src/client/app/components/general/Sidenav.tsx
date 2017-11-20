import React, {Component} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {BaseComponentProps} from "../BaseComponent";
import {Dispatcher} from "../../service/Dispatcher";
import {ConfigService} from "../../service/ConfigService";
import Navbar from "./Navbar";

export interface SideNavProps extends BaseComponentProps {
    name: string;
}

export interface SideNavState {
    open: boolean;
}

export class Sidenav extends Component<SideNavProps, SideNavState> {
    private dispatcher = Dispatcher.getInstance();
    public name = '';
    private transTime = ConfigService.getConfig().transition;

    constructor(props: SideNavProps) {
        super(props);
        this.state = {
            open: false
        };
    }

    public close = () => {
        this.setState({open: false});
        document.documentElement.classList.remove('sidenav-open');
    }

    public open = () => {
        this.setState({open: true});
        document.documentElement.classList.add('sidenav-open');
    }

    public toggle = () => {
        this.state.open ? this.close() : this.open();
    }

    public componentWillMount() {
        let name = this.props.name;
        this.dispatcher.register(`${name}-toggle`, this.toggle);
        this.dispatcher.register(`${name}-open`, this.open);
        this.dispatcher.register(`${name}-close`, this.close);
    }

    public render() {
        let navContent = null;
        let {enter, leave} = this.transTime;
        if (this.state.open) {
            navContent = <aside className="sidenav-component">
                <Navbar className="navbar-transparent" backAction={this.close}/>
                <div onClick={this.close} className="sidenav-backdrop">&nbsp;</div>
                <div className="sidenav">{this.props.children}</div>
            </aside>
        }
        return (
            <ReactCSSTransitionGroup transitionName="sidenav" transitionEnterTimeout={enter / 2}
                                     transitionLeaveTimeout={leave / 2}>
                {navContent}
            </ReactCSSTransitionGroup>
        );
    }
}



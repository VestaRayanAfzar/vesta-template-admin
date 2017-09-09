import React from "react";
import {Dispatcher} from "../../service/Dispatcher";

export interface SideNavProps {
    name: string;
}

export interface SideNavState {
    open: boolean;
}

export class Sidenav extends React.Component<SideNavProps, SideNavState> {
    private dispatcher = Dispatcher.getInstance();
    public name = '';

    constructor(props: SideNavProps) {
        super(props);
        this.state = {
            open: false
        };
    }

    public close() {
        this.setState({open: false});
    }

    public open() {
        this.setState({open: true});
    }

    public toggle() {
        this.setState({open: !this.state.open});
    }

    public componentWillMount() {
        let name = this.props.name;
        this.dispatcher.register(`${name}-toggle`, this.toggle.bind(this));
        this.dispatcher.register(`${name}-open`, this.open.bind(this));
        this.dispatcher.register(`${name}-close`, this.close.bind(this));
    }

    public render() {
        let backDrop = this.state.open ? <div onClick={this.close.bind(this)} className="sidenav-backdrop">&nbsp;</div> : null;
        let content = this.state.open ? <div className="sidenav sidenav-open">{this.props.children}</div> : null;
        return (
            <div className="sidenav-component">
                {content}
                {backDrop}
            </div>
        );
    }
}



import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface AvatarProps extends BaseComponentProps {
    src: string;
    defaultSrc?: string;
}

export class Avatar extends PureComponent<AvatarProps, null> {
    private wrapper;

    private renderInitials() {

    }

    private imageLoadError = (e) => {
        console.log(e);
    }

    public render() {
        const {src, defaultSrc} = this.props;
        let imageSrc = null;
        if (src) {
            imageSrc = src;
        }
        else if (defaultSrc){
            imageSrc = defaultSrc;
        }

        return (
            <div className="avatar-component" ref={el => this.wrapper = el}>
                <img src={this.props.src}/>
                {this.props.children}
            </div>
        )
    }
}
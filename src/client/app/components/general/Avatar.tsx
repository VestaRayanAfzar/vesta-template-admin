import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../BaseComponent";

export interface IAvatarProps extends IBaseComponentProps {
    src: string;
    defaultSrc?: string;
    onClick?: (e) => void;
}

export class Avatar extends PureComponent<IAvatarProps, null> {
    private wrapper;
    private loadDefault = false;
    private faileCount = 0;

    public componentDidUpdate() {
        // after rendering default, set it to false in case of future props changes
        this.loadDefault = false;
    }

    public render() {
        const { src, defaultSrc, onClick } = this.props;
        const imageSrc = this.loadDefault ? defaultSrc : (src || defaultSrc);
        const avatar = imageSrc ? <img src={imageSrc} onError={this.imageLoadError} /> :
            <div className="avatar-holder" />;

        return (
            <div className="avatar" ref={(el) => this.wrapper = el} onClick={this.onClick}>
                {avatar}
                {this.props.children}
            </div>
        );
    }

    private imageLoadError = (e) => {
        ++this.faileCount;
        if (this.faileCount > 3) { return; }
        this.loadDefault = true;
        this.forceUpdate();
    }

    private onClick = (e) => {
        const { onClick } = this.props;
        if (onClick) {
            onClick(e);
        }
    }
}

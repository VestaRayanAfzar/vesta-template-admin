import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface AvatarProps extends BaseComponentProps {
    src: string;
    defaultSrc?: string;
}

export class Avatar extends PureComponent<AvatarProps, null> {
    private wrapper;
    private loadDefault = false;
    private faileCount = 0;

    public componentDidUpdate() {
        // after rendering default, set it to false in case of future props changes
        this.loadDefault = false;
    }

    private imageLoadError = (e) => {
        ++this.faileCount;
        if (this.faileCount > 3) return;
        this.loadDefault = true;
        this.forceUpdate();
    }

    public render() {
        const {src, defaultSrc} = this.props;
        let imageSrc = this.loadDefault ? defaultSrc : (src || defaultSrc);
        let avatar = imageSrc ? <img src={imageSrc} onError={this.imageLoadError}/> :
            <div className="avatar-holder"/>
        return (
            <div className="avatar" ref={el => this.wrapper = el}>
                {avatar}
                {this.props.children}
            </div>
        )
    }
}
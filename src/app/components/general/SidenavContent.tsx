import { Culture, Dispatcher } from "@vesta/core";
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../cmn/models/User";
import { getFileUrl } from "../../util/Util";
import { IBaseComponentProps } from "../BaseComponent";
import { Avatar } from "./Avatar";
import { Select } from "./form/Select";
import { Icon } from "./Icon";
import { IMenuItem, Menu } from "./Menu";

interface ISidenavContentProps extends IBaseComponentProps {
    menuItems: IMenuItem[];
    name: string;
    user: IUser;
}

interface ISidenavContentState {
    locale: number;
}

export class SidenavContent extends PureComponent<ISidenavContentProps, ISidenavContentState> {
    private dispatch = Dispatcher.getInstance().dispatch;
    private localeOptions: any[];
    private tr = Culture.getDictionary().translate;

    public constructor(props: ISidenavContentProps) {
        super(props);
        const locale = Culture.getLocale().code;
        this.state = { locale: locale === "fa-IR" ? 0 : 1 };
        this.localeOptions = [
            { id: 0, locale: "fa-IR", title: this.tr("persian") },
            { id: 1, locale: "en-US", title: this.tr("english") },
        ];
    }

    public render() {
        const { user = {}, menuItems } = this.props;
        const { locale } = this.state;
        const editLink = user && user.id ?
            <Link to="/profile" onClick={this.closeSidenav}><Icon name="settings" /></Link> : null;
        let userImage: string = "";
        if (user.image) {
            userImage = getFileUrl(`user/${user.image}`);
        }

        return (
            <div className="sidenav-content">
                <header>
                    <Avatar src={userImage} defaultSrc="img/icons/192x192.png" />
                    <div className="name-wrapper">
                        <h4>{user.username}</h4>
                        {editLink}
                        <Select name="lng" label={this.tr("locale")} value={locale} placeholder={true}
                            options={this.localeOptions} onChange={this.onLocaleChange} />
                    </div>
                </header>
                <main>
                    <Menu name="nav" items={menuItems} onItemSelect={this.closeSidenav} />
                </main>
            </div>
        );
    }

    private closeSidenav = () => {
        this.dispatch(`${this.props.name}-close`, null);
        return true;
    }

    private onLocaleChange = (name: string, value: number) => {
        const locale = this.localeOptions[value].locale;
        Culture.setDefault(locale);
        (window as any).loadLocale(locale, true);
    }
}

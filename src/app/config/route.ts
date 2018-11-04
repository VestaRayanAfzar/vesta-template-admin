import { ComponentClass } from "react";
import { Forget } from "../components/root/Forget";
import { Home } from "../components/root/Home";
import { Log } from "../components/root/Log";
import { Login } from "../components/root/Login";
import { Logout } from "../components/root/Logout";
import { Profile } from "../components/root/Profile";
import { Role } from "../components/root/Role";
import { User } from "../components/root/User";
import { Translate } from "../medium";
import { IPermissionCollection } from "../service/AuthService";

export interface IRouteItem {
    abstract?: boolean;
    children?: IRouteItem[];
    component?: ComponentClass<any>;
    exact?: boolean;
    // show/hide this item in menu list
    hidden?: boolean;
    // show icon on menu
    icon?: string;
    link: string;
    permissions?: IPermissionCollection;
    title: string;
}

export function getRoutes(isLoggedIn: boolean): IRouteItem[] {
    const tr = Translate.getInstance().translate;

    const userRoutes = [
        { link: "", title: tr("home"), component: Home, exact: true },
        { link: "user", title: tr("mdl_user"), component: User, permissions: { user: ["read"] } },
        { link: "role", title: tr("mdl_role"), component: Role, permissions: { role: ["read"] } },
        { link: "log", title: tr("mdl_log"), component: Log, permissions: { log: ["read"] } },
        { link: "profile", title: tr("profile"), component: Profile, hidden: true },
        { link: "logout", title: tr("logout"), component: Logout },
    ];
    const guestRoutes = [
        { link: "", title: tr("login"), component: Login, exact: true },
        { link: "forget", title: tr("forget_pass"), component: Forget, hidden: true },
    ];
    return isLoggedIn ? userRoutes : guestRoutes;
}

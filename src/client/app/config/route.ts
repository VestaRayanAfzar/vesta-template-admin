import {ComponentClass} from "react";
import {IPermissionCollection} from "../service/AuthService";
import {Login} from "../components/root/Login";
import {Home} from "../components/root/Home";
import {Profile} from "../components/root/Profile";
import {Role} from "../components/root/Role";
import {Logout} from "../components/root/Logout";
import {TranslateService} from "../service/TranslateService";
import {Forget} from "../components/root/Forget";
import {User} from "../components/root/User";
import {Context} from "../components/root/Context";

export interface RouteItem {
    link: string;
    title: string;
    exact?: boolean;
    abstract?: boolean;
    children?: Array<RouteItem>;
    component?: ComponentClass<any>;
    permissions?: IPermissionCollection;
}

export function getRoutes(isLoggedIn: boolean): Array<RouteItem> {
    const tr = TranslateService.getInstance().translate;

    return isLoggedIn ? [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'context', title: tr('context'), component: Context, permissions: {context: ['read']}},
        {link: 'user', title: tr('users'), component: User, permissions: {user: ['read']}},
        {link: 'role', title: tr('roles'), component: Role, permissions: {role: ['read']}},
        {link: 'profile', title: tr('profile'), component: Profile, permissions: {role: ['read']}},
        {link: 'logout', title: tr('logout'), component: Logout, permissions: {account: ['logout']}}
    ] : [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'login', title: tr('login'), component: Login, permissions: {account: ['login']}},
        {link: 'forget', title: tr('forget_pass'), component: Forget, permissions: {account: ['forget']}},
    ]
}
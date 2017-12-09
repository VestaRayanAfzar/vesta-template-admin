import {ComponentClass} from "react";
import {IPermissionCollection} from "../service/AuthService";
import {TranslateService} from "../service/TranslateService";
import {Login} from "../components/root/Login";
import {Forget} from "../components/root/Forget";
import {Logout} from "../components/root/Logout";
import {Home} from "../components/root/Home";
import {Contact} from "../components/root/Contact";
import {Context} from "../components/root/Context";
import {User} from "../components/root/User";
import {Role} from "../components/root/Role";
import {Profile} from "../components/root/Profile";

export interface RouteItem {
    link: string;
    title: string;
    exact?: boolean;
    abstract?: boolean;
    children?: Array<RouteItem>;
    component?: ComponentClass<any>;
    permissions?: IPermissionCollection;
    // show/hide in menu list
    hidden?: boolean;
}

export function getRoutes(isLoggedIn: boolean): Array<RouteItem> {
    const tr = TranslateService.getInstance().translate;

    return isLoggedIn ? [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'contact', title: tr('mdl_contact'), component: Contact, permissions: {contact: ['read']}},
        {link: 'context', title: tr('mdl_context'), component: Context, permissions: {context: ['read']}},
        {link: 'user', title: tr('mdl_user'), component: User, permissions: {user: ['read']}},
        {link: 'role', title: tr('mdl_role'), component: Role, permissions: {role: ['read']}},
        {link: 'profile', title: tr('profile'), component: Profile, permissions: {role: ['read']}, hidden: true},
        {link: 'logout', title: tr('logout'), component: Logout, permissions: {account: ['logout']}},
    ] : [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'login', title: tr('login'), component: Login, permissions: {account: ['login']}},
        {link: 'forget', title: tr('forget_pass'), component: Forget, permissions: {account: ['forget']}},
    ]
}
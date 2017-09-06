import {ComponentClass} from "react";
import {IPermissionCollection} from "../service/AuthService";
import {Login} from "../components/root/Login";
import {Home} from "../components/root/Home";
import {Logout} from "../components/root/Logout";

export interface RouteItem {
    link: string;
    title: string;
    component?: ComponentClass<any>;
    exact?: boolean;
    children?: Array<RouteItem>;
    permissions?: IPermissionCollection;
}

export function getRoutes(isLoggedIn: boolean): Array<RouteItem> {
    return isLoggedIn ? [
        {link: '', title: 'Dashboard', component: Home, exact: true, permissions: {index: ['index']}},
        {link: 'logout', title: 'Logout', component: Logout, permissions: {account: ['logout']}}
    ] : [
        {link: 'login', title: 'Login', component: Login, permissions: {account: ['login']}},
    ]
}
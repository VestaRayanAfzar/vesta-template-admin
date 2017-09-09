import {ComponentClass} from "react";
import {IPermissionCollection} from "../service/AuthService";
import {Login} from "../components/root/Login";
import {Home} from "../components/root/Home";
import {Logout} from "../components/root/Logout";
import {About} from "../components/root/About";

export interface RouteItem {
    link: string;
    title: string;
    exact?: boolean;
    children?: Array<RouteItem>;
    component?: ComponentClass<any>;
    permissions?: IPermissionCollection;
}

export function getRoutes(isLoggedIn: boolean): Array<RouteItem> {
    return isLoggedIn ? [
        {link: '', title: 'Dashboard', component: Home, exact: true, permissions: {index: ['index']}},
        {link: 'about', title: 'About', component: About, exact: true, permissions: {index: ['about']}},
        {link: 'logout', title: 'Logout', component: Logout, permissions: {account: ['logout']}}
    ] : [
        {link: 'about', title: 'About', component: About, exact: true, permissions: {index: ['about']}},
        {link: 'login', title: 'Login', component: Login, permissions: {account: ['login']}},
    ]
}
import { Culture } from "@vesta/core";
import { Component } from "react";
import { IPaginationConfig } from "../config/appConfig";
import { ApiService } from "../service/ApiService";
import { AuthService } from "../service/AuthService";
import { Config } from "../service/Config";
import { NotificationService } from "../service/NotificationService";
import { TransitionService } from "../service/TransitionService";
import { IBaseComponentWithRouteProps } from "./BaseComponent";

export interface IPageComponentProps<T> extends IBaseComponentWithRouteProps<T> {
}

export abstract class PageComponent<P, S> extends Component<P, S> {
    protected api: ApiService = ApiService.getInstance();
    protected auth: AuthService = AuthService.getInstance();
    protected notif: NotificationService = NotificationService.getInstance();
    protected pagination: IPaginationConfig = Config.getConfig().pagination;
    protected tr = Culture.getDictionary().translate;
    protected tz = TransitionService.getInstance().willTransitionTo;
}

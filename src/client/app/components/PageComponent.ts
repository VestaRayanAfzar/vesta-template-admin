import {Component} from "react";
import {BaseComponentProps} from "./BaseComponent";
import {match} from "react-router";
import {IQueryRequest} from "../cmn/core/ICRUDResult";
import {ApiService} from "../service/ApiService";
import {NotificationService} from "../service/NotificationService";
import {TransitionService} from "../service/TransitionService";
import {TranslateService} from "../service/TranslateService";
import {AuthService} from "../service/AuthService";
import {ConfigService, IPaginationConfig} from "../service/ConfigService";

export interface FetchById<T> {
    (id: number): Promise<T>;
}

export interface Search<T> {
    (term: string): Promise<Array<T>>;
}

export interface FetchAll<T> {
    (query: IQueryRequest<T>): void;
}

export interface Save<T> {
    (model: T): void;
}

export interface PageComponentProps<T> extends BaseComponentProps {
    match?: match<T>;
}

export interface PageComponentState {
}

export abstract class PageComponent<P, S> extends Component<P, S> {

    protected tr = TranslateService.getInstance().translate;
    protected tz = TransitionService.getInstance().willTransitionTo;
    protected api: ApiService = ApiService.getInstance();
    protected auth: AuthService = AuthService.getInstance();
    protected notif: NotificationService = NotificationService.getInstance();
    //
    protected pagination: IPaginationConfig = ConfigService.getConfig().pagination;
}
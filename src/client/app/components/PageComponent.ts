import {Component, ReactNode} from "react";
import {ApiService} from "../service/ApiService";
import {match} from "react-router";
import {History, Location} from "history";
import {NotificationService} from "../service/NotificationService";
import {TransitionService} from "../service/TransitionService";
import {TranslateService} from "../service/TranslateService";

export interface FetchById<T> {
    (id: number): Promise<T>;
}

export interface Filter {
    (): void;
}

export interface PageComponentProps<T> {
    match?: match<T>;
    location?: Location;
    history?: History;
    children?: ReactNode;
}

export interface PageComponentState {
}

export abstract class PageComponent<P, S> extends Component<P, S> {

    protected tr: TranslateService = TranslateService.getInstance();
    protected tz: TransitionService = TransitionService.getInstance();
    protected api: ApiService = ApiService.getInstance();
    protected notif: NotificationService = NotificationService.getInstance();

}
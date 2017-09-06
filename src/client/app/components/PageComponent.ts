import {Component, ReactNode} from "react";
import {ApiService} from "../service/ApiService";
import {match} from "react-router";
import {History, Location} from "history";
import {NotificationService} from "../service/NotificationService";
import {TransitionService} from "../service/TransitionService";

export interface FetchById {
    (id: number): void;
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

    protected tz: TransitionService = TransitionService.getInstance();
    protected api: ApiService = ApiService.getInstance();
    protected notification: NotificationService = NotificationService.getInstance();

}
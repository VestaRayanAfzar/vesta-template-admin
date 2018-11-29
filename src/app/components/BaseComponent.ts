import { History, Location } from "history";
import { ReactNode } from "react";
import { match } from "react-router";

export interface IBaseComponentProps {
    children?: ReactNode;
    history?: History;
    location?: Location;
}

export interface IBaseComponentWithRouteProps<T> extends IBaseComponentProps {
    match?: match<T>;
}

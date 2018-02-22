import {History, Location} from "history";
import {ReactNode} from "react";

export interface IBaseComponentProps {
    location?: Location;
    history?: History;
    children?: ReactNode;
}

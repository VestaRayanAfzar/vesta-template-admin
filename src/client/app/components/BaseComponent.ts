import {ReactNode} from "react";
import {History, Location} from "history";

export interface BaseComponentProps {
    location?: Location;
    history?: History;
    children?: ReactNode;
}

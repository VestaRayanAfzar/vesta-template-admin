import { History, Location } from "history";
import { ReactNode } from "react";

export interface IBaseComponentProps {
    children?: ReactNode;
    history?: History;
    location?: Location;
}

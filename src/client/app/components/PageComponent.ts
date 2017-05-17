import React from "react";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";

interface PageComponentProps {
}
interface PageComponentState {
}

export class PageComponent<P, S> extends React.Component<PageComponentProps, PageComponentState> {

    protected apiService: ApiService = ApiService.getInstance();
    protected authService: AuthService = AuthService.getInstance();

}
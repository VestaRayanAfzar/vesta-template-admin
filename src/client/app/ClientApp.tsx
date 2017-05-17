import React, {ComponentClass} from "react";
import ReactDOM from "react-dom";
import ReactRouterDOM from "react-router-dom";
import {AuthService} from "./service/AuthService";
import {AclPolicy} from "./cmn/enum/Acl";
import {NotFound} from "./components/root/NotFound";
import {About} from "./components/root/About";
import {Signup} from "./components/root/Signup";
import {Login} from "./components/root/Login";
import {Home} from "./components/root/Home";
import {Root} from "./components/Root";
import {IClientAppSetting} from "./config/setting";
import {Forbidden} from "./components/root/Forbidden";

interface ExtComponentClass extends ComponentClass<any> {
    registerPermission: (id: number) => void;
}

export class ClientApp {

    static Setting;
    private idCounter = 1;

    constructor(private setting: IClientAppSetting) {
    }

    public init() {
        this.registerServiceWorker();
        //<web>
        AuthService.getInstance().setDefaultPolicy(AclPolicy.Allow);
        //</web>
        //<cordova>
        Keyboard.hideFormAccessoryBar(true);
        Keyboard.disableScrollingInShrinkView(true);
        Keyboard.shrinkView(true);
        StatusBar.styleDefault();
        //</cordova>
    }

    private registerServiceWorker() {
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('js/sw.js')
        //         .then(registration=> {
        //             console.log('serviceWorker registered', registration);
        //         })
        //         .catch(err=>console.error(err));
        // }
    }

    protected willTransitionTo(Component: ExtComponentClass) {
        let id = this.idCounter++;
        Component.registerPermission(id);
        return (props) => {
            return AuthService.getInstance().hasAccessToState(id) ? React.createElement(Component, props) :
                React.createElement(Forbidden, props);
        }
    }

    public run() {
        let {HashRouter, Route, Switch} = ReactRouterDOM;
        let Router = HashRouter;
        ReactDOM.render(
            <Router>
                <Root>
                    <Switch>
                        <Route path="/" render={this.willTransitionTo(Home)} exact/>
                        <Route path="/login" render={this.willTransitionTo(Login)}/>
                        <Route path="/signup" render={this.willTransitionTo(Signup)}/>
                        <Route path="/about" render={this.willTransitionTo(About)}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Root>
            </Router>,
            document.getElementById("root")
        );
    }
}

import React from "react";
import {render} from "react-dom";
import {Route, Switch} from "react-router";
import {DynamicRouter} from "./medium";
import {AuthService} from "./service/AuthService";
import {AclPolicy} from "./cmn/enum/Acl";
import {Dispatcher} from "./service/Dispatcher";
import {NotFound} from "./components/root/NotFound";
import {Root} from "./components/Root";
import {IUser} from "./cmn/models/User";
import {TransitionService} from "./service/TransitionService";
import {getRoutes, RouteItem} from "./config/route";


export class ClientApp {
    private tz = TransitionService.getInstance();
    private auth = AuthService.getInstance();

    public init() {
        this.registerServiceWorker();
        this.auth.setDefaultPolicy(AclPolicy.Deny);
        //<cordova>
        Keyboard.hideFormAccessoryBar(true);
        Keyboard.disableScrollingInShrinkView(true);
        Keyboard.shrinkView(true);
        StatusBar.styleDefault();
        //</cordova>
        // auth event registration
        Dispatcher.getInstance().register<{ user: IUser }>(AuthService.Events.Update, this.run.bind(this));
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

    private getRoutes(routeItems: Array<RouteItem>) {
        return routeItems.map((item, index) => {
            return <Route path={`/${item.link}`} key={index} exact={item.exact}
                          render={this.tz.willTransitionTo(item.component, item.permissions)}/>;
        });
    }

    public run() {
        const routeItems = getRoutes(!this.auth.isGuest());
        let routes = this.getRoutes(routeItems);
        render(
            <DynamicRouter>
                <Root routeItems={routeItems}>
                    <Switch>
                        {routes}
                        <Route component={NotFound}/>
                    </Switch>
                </Root>
            </DynamicRouter>,
            document.getElementById("root")
        );
    }
}

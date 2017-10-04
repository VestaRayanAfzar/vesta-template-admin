import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {Route, Switch} from "react-router";
import {IValidationError} from "../../medium";
import {DynamicRouter} from "../../medium";
import {PageTitle} from "../general/PageTitle";
import {Preloader} from "../general/Preloader";
import {CrudMenu} from "../general/CrudMenu";
import {IState, State as StateModel} from "../../cmn/models/State";
import {StateAdd} from "./state/StateAdd";
import {StateEdit} from "./state/StateEdit";
import {StateDetail} from "./state/StateDetail";
import {StateList} from "./state/StateList";

export interface StateParams {
}

export interface StateProps extends PageComponentProps<StateParams> {
}

export interface StateState extends PageComponentState {
    showLoader: boolean;
    validationErrors: IValidationError;
}

export class State extends PageComponent<StateProps, StateState> {

    constructor(props: StateProps) {
        super(props);
        this.state = {validationErrors: null, showLoader: false};
    }

    public fetch = (id: number) => {
        this.setState({showLoader: true});
        return this.api.get<IState>(`state/${id}`)
            .then(response => {
                this.setState({showLoader: false});
                return response.items[0];
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(error.message);
            })
    }

    public fetchAll = () => {
        this.setState({showLoader: true});
        return this.api.get<IState>('state')
            .then(response => {
                this.setState({showLoader: false});
                return response.items;
            })
            .catch(error => {
                this.setState({showLoader: false});
                this.notif.error(error.message);
            })
    }

    public save = (model: IState) => {
        let state = new StateModel(model);
        const saveType = state.id ? 'update' : 'add';
        let validationResult = state.validate();
        if (validationResult) {
            return this.setState({validationErrors: validationResult});
        }
        this.setState({showLoader: true});
        let data = state.getValues<IState>();
        (model.id ? this.api.put<IState>('state', data) : this.api.post<IState>('state', data))
            .then(response => {
                this.setState({showLoader: false});
                this.notif.success(this.tr.translate(`info_${saveType}_record`, `${response.items[0].id}`));
                this.props.history.goBack();
            })
            .catch(error => {
                this.setState({showLoader: false, validationErrors: error.validation});
                this.notif.error(error.message);
            });
    }

    public render() {
        const tr = this.tr.translate;
        return (
            <div className="page state-component">
                <PageTitle title={tr('mdl_state')}/>
                <h1>{tr('mdl_state')}</h1>
                <Preloader options={{show: this.state.showLoader}}/>
                <CrudMenu path="state"/>
                <DynamicRouter>
                    <Switch>
                        <Route path="/state/add" render={this.tz.willTransitionTo(StateAdd, {state: ['add']},{
                            save: this.save,
                            validationErrors: this.state.validationErrors
                        })}/>
                        <Route path="/state/edit/:id" render={this.tz.willTransitionTo(StateEdit, {state: ['edit']}, {
                            save: this.save,
                            fetch: this.fetch,
                            validationErrors: this.state.validationErrors
                        })}/>
                        <Route path="/state/detail/:id" render={this.tz.willTransitionTo(StateDetail, {state: ['read']}, {
                            fetch: this.fetch
                        })}/>
                        <Route render={this.tz.willTransitionTo(StateList, {state: ['read']}, {
                            fetch: this.fetchAll
                        })}/>
                    </Switch>
                </DynamicRouter>
            </div>);
    }
}

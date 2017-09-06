import * as React from "react";
import {AuthService} from "../../service/AuthService";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IQueryResult} from "../../medium";
import {IUser} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import {Util} from "../../util/Util";

export interface LoginParams {
}

export interface LoginProps extends PageComponentProps<LoginParams> {
}

export interface LoginState extends PageComponentState {
    showLoader: boolean;
    user: IUser;
}

export class Login extends PageComponent<LoginProps, LoginState> {
    private auth: AuthService = AuthService.getInstance();

    constructor(props: LoginProps) {
        super(props);
        this.state = {showLoader: false, user: {}};
    }

    private onChange = (name: string, value: string) => {
        let user = Util.shallowClone(this.state.user);
        user[name] = value;
        this.setState({user});
    }

    private onSubmit = () => {
        this.setState({showLoader: true});
        this.api.post<IQueryResult<IUser>>('account/login', JSON.stringify(this.state.user))
            .then(response => {
                if (response) {
                    this.auth.login(response.items[0]);
                }
                this.props.history.push('/');
            })
            .catch(error => {
                this.notification.toast(error.message);
                this.setState({showLoader: false});
            })
    }

    public render() {
        const user = this.state.user;
        return (
                <div className="page">
                <Preloader options={{show: this.state.showLoader}}/>
                <FormWrapper name="loginForm" onSubmit={this.onSubmit}>
                    <FormTextInput name="username" label="Username" value={user.username}
                                   onChange={this.onChange}/>
                    <FormTextInput name="password" label="Password" value={user.password} secret={true}
                                   onChange={this.onChange}/>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                </FormWrapper>
                </div>
        )
    }
}

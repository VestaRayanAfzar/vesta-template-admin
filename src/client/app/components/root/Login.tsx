import React from "react";
import {Link} from "react-router-dom";
import {AuthService} from "../../service/AuthService";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IUser} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import {Util} from "../../util/Util";
import {Alert} from "../general/Alert";

export interface LoginParams {
}

export interface LoginProps extends PageComponentProps<LoginParams> {
}

export interface LoginState extends PageComponentState {
    showLoader: boolean;
    user: IUser;
    error: string;
}

export class Login extends PageComponent<LoginProps, LoginState> {
    private auth: AuthService = AuthService.getInstance();

    constructor(props: LoginProps) {
        super(props);
        this.state = {showLoader: false, user: {}, error: ''};
    }

    private onChange = (name: string, value: string) => {
        let user = Util.shallowClone(this.state.user);
        user[name] = value;
        this.setState({user});
    }

    private onSubmit = () => {
        this.setState({showLoader: true});
        this.api.post<IUser>('account/login', this.state.user)
            .then(response => {
                if (response) {
                    this.auth.login(response.items[0]);
                }
                this.props.history.push('/');
            })
            .catch(error => {
                this.notif.error(error.message);
                this.setState({showLoader: false, error: this.tr.translate('err_login')});
            })
    }

    public render() {
        const tr = this.tr.translate;
        const user = this.state.user;
        const h = this.props.history;
        let err = this.state.error ? <Alert type="error">{tr('err_login')}</Alert> : null;
        return <div className="page">
                <Preloader options={{show: this.state.showLoader}}/>
                <FormWrapper name="loginForm" onSubmit={this.onSubmit}>
                {err}
                <FormTextInput name="username" label={tr('fld_username')} value={user.username}
                                   onChange={this.onChange}/>
                <FormTextInput name="password" label={tr('fld_password')} value={user.password} type="password"
                                   onChange={this.onChange}/>
                <div className="form-group btn-group">
                    <button type="submit" className="btn btn-primary">{tr('login')}</button>
                    <Link to="forget" className="btn btn-default">{tr('forget_pass')}</Link>
                        </div>
                </FormWrapper>
                </div>
    }
}

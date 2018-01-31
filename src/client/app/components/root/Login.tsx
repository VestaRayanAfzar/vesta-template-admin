import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {IUser, User} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import {FieldValidationMessage, ModelValidationMessage, validationMessage} from "../../util/Util";
import {Alert} from "../general/Alert";
import {IValidationError} from "../../cmn/core/Validator";
import {StorageService} from "../../service/StorageService";

export interface LoginParams {
}

export interface LoginProps extends PageComponentProps<LoginParams> {
}

export interface LoginState extends PageComponentState {
    showLoader: boolean;
    user: IUser;
    error: string;
    validationErrors?: IValidationError;
}

export class Login extends PageComponent<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {showLoader: false, user: {}, error: ''};
    }

    public componentDidMount() {
        if (!this.auth.isGuest()) {
            // if it's a user logout first
            this.props.history.push('/logout');
        }
    }

    private onChange = (name: string, value: string) => {
        this.state.user[name] = value;
        this.setState({user: this.state.user});
    }

    private onSubmit = () => {
        let user = new User(this.state.user);
        let validationResult = user.validate('username', 'password');
        if (validationResult) {
            return this.setState({validationErrors: validationResult});
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.post<IUser>('account/login', user.getValues('username', 'password'))
            .then(response => {
                this.auth.login(response.items[0]);
            })
            .catch(error => {
                this.setState({showLoader: false, error: this.tr('err_wrong_user_pass')});
                if (error.message == 'err_db_no_record') return;
                this.notif.error(error.message);
            })
    }

    public render() {
        const {validationErrors, showLoader, error, user} = this.state;
        const formErrorsMessages: ModelValidationMessage = {
            username: {
                required: this.tr('err_required'),
                minLength: this.tr('err_min_length', 4),
                maxLength: this.tr('err_max_length', 16)
            },
            password: {
                required: this.tr('err_required'),
                minLength: this.tr('err_min_length', 4),
                maxLength: this.tr('err_max_length', 16)
            }
        };
        let errors: FieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
        let loginErr = error ? <Alert type="error">{this.tr('err_wrong_user_pass')}</Alert> : null;
        return (
            <div className="page login-page has-navbar page-logo-form">
                <Navbar className="navbar-transparent" showBurger={true}/>
                <Preloader show={showLoader}/>
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/vesta-logo.png" alt="Vesta Logo"/>
                    </div>
                </div>
                <FormWrapper name="loginForm" onSubmit={this.onSubmit}>
                    {loginErr}
                    <FormTextInput name="username" label={this.tr('fld_username')} value={user.username}
                                   error={errors.username} onChange={this.onChange} placeholder={true}/>
                    <FormTextInput name="password" label={this.tr('fld_password')} value={user.password} type="password"
                                   error={errors.password} onChange={this.onChange} placeholder={true}/>
                    <p className="forget-link">
                        <Link to="forget">{this.tr('forget_pass')}</Link>
                    </p>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr('login')}</button>
                    </div>
                </FormWrapper>
            </div>
        )
    }
}

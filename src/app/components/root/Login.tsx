import { IValidationError } from "@vesta/core";
import React from "react";
import { Link } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { IModelValidationMessage, validationMessage } from "../../util/Util";
import { Alert } from "../general/Alert";
import { FormWrapper } from "../general/form/FormWrapper";
import { TextInput } from "../general/form/TextInput";
import Navbar from "../general/Navbar";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface ILoginParams {
}

interface ILoginProps extends IPageComponentProps<ILoginParams> {
}

interface ILoginState {
    error: string;
    user: IUser;
    validationErrors?: IValidationError;
}

export class Login extends PageComponent<ILoginProps, ILoginState> {
    private formErrorsMessages: IModelValidationMessage;

    constructor(props: ILoginProps) {
        super(props);
        this.state = { user: {}, error: "" };
        this.formErrorsMessages = {
            password: {
                maxLength: this.tr("err_max_length", 16),
                minLength: this.tr("err_min_length", 4),
                required: this.tr("err_required"),
            },
            username: {
                maxLength: this.tr("err_max_length", 16),
                minLength: this.tr("err_min_length", 4),
                required: this.tr("err_required"),
            },
        };
    }

    public componentDidMount() {
        if (!this.auth.isGuest()) {
            // if it's a user logout first
            this.props.history.push("/logout");
        }
    }

    public render() {
        const { validationErrors, error, user } = this.state;
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};
        const loginErr = error ? <Alert type="error">{this.tr("err_wrong_user_pass")}</Alert> : null;

        return (
            <div className="page login-page has-navbar page-logo-form">
                <Navbar className="navbar-transparent" showBurger={true} />
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/icons/144x144.png" alt="Vesta Logo" />
                    </div>
                </div>
                <FormWrapper name="loginForm" onSubmit={this.onSubmit}>
                    {loginErr}
                    <TextInput name="username" label={this.tr("fld_username")} value={user.username}
                        error={errors.username} onChange={this.onChange} placeholder={true} />
                    <TextInput name="password" label={this.tr("fld_password")} value={user.password} type="password"
                        error={errors.password} onChange={this.onChange} placeholder={true} />
                    <p className="forget-link">
                        <Link to="forget">{this.tr("forget_pass")}</Link>
                    </p>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr("login")}</button>
                    </div>
                </FormWrapper>
            </div>
        );
    }

    private onChange = (name: string, value: string) => {
        this.state.user[name] = value;
        this.setState({ user: this.state.user });
    }

    private onSubmit = () => {
        const user = new User(this.state.user);
        const validationResult = user.validate("username", "password");
        if (validationResult) {
            return this.setState({ validationErrors: validationResult });
        }
        Preloader.show();
        this.setState({ validationErrors: null });
        this.api.post<IUser>("account/login", user.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                this.auth.login(response.items[0]);
            })
            .catch((error) => {
                Preloader.hide();
                this.setState({ error: this.tr("err_wrong_user_pass") });
                if (error.message == "err_db_no_record") { return; }
                this.notif.error(error.message);
            });
    }
}

import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IUser, User} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import Navbar from "../general/Navbar";
import {Alert} from "../general/Alert";
import {FieldValidationMessage, ModelValidationMessage, validationMessage} from "../../util/Util";
import {IValidationError} from "../../cmn/core/Validator";

export interface ForgetParams {
}

export interface ForgetProps extends PageComponentProps<ForgetParams> {
}

export interface ForgetState extends PageComponentState {
    showLoader: boolean;
    mobile: string;
    message: string;
    validationErrors: IValidationError;
}

export class Forget extends PageComponent<ForgetProps, ForgetState> {

    constructor(props: ForgetProps) {
        super(props);
        this.state = {showLoader: false, mobile: '', message: '', validationErrors: null};
    }

    private onChange = (name: string, value: string) => {
        this.setState({mobile: value});
    }

    private onSubmit = () => {
        let user = new User({mobile: this.state.mobile});
        let validationErrors = user.validate('mobile');
        if (validationErrors) {
            return this.setState({validationErrors});
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.post<IUser>('account/forget', {mobile: this.state.mobile})
            .then(response => {
                this.setState({showLoader: false});
                this.notif.success(this.tr('info_forget'));
                this.props.history.push('/login');
            })
            .catch(error => {
                this.setState({showLoader: false, validationErrors: error.violations});
            })
    }

    public render() {
        const {message, validationErrors, showLoader, mobile} = this.state;
        const formErrorsMessages: ModelValidationMessage = {
            mobile: {
                required: this.tr('err_required'),
                type: this.tr('err_phone'),
                minLength: this.tr('err_min_length', 9),
                maxLength: this.tr('err_max_length', 12),
                invalid: this.tr('err_invalid_phone')
            }
        };
        let errors: FieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
        let alert = message ? <Alert type="info">{message}</Alert> : null;
        return (
            <div className="page forget-page has-navbar page-logo-form">
                <Navbar showBurger={true} className="navbar-transparent"/>
                <Preloader show={showLoader}/>
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/vesta-logo.png" alt="Vesta Logo"/>
                    </div>
                </div>
                <FormWrapper name="ForgetForm" onSubmit={this.onSubmit}>
                    <FormTextInput name="mobile" label={this.tr('fld_mobile')} value={mobile} type="tel"
                                   error={errors.mobile} placeholder={true} onChange={this.onChange}/>
                    {alert}
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr('send_reset')}</button>
                        <br/>
                        <Link to="login" className="btn">{this.tr('login')}</Link>
                    </div>
                </FormWrapper>
            </div>
        )
    }
}

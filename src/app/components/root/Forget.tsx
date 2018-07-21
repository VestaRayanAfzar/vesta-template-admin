import React from "react";
import { Link } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { IValidationError } from "../../medium";
import { IModelValidationMessage, validationMessage } from "../../util/Util";
import { Alert } from "../general/Alert";
import { FormTextInput } from "../general/form/FormTextInput";
import { FormWrapper } from "../general/form/FormWrapper";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface IForgetParams {
}

interface IForgetProps extends IPageComponentProps<IForgetParams> {
}

interface IForgetState {
    message: string;
    mobile: string;
    showLoader?: boolean;
    validationErrors?: IValidationError;
}

export class Forget extends PageComponent<IForgetProps, IForgetState> {
    private formErrorsMessages: IModelValidationMessage;

    constructor(props: IForgetProps) {
        super(props);
        this.state = { mobile: "", message: "" };
        this.formErrorsMessages = {
            mobile: {
                invalid: this.tr("err_invalid_phone"),
                maxLength: this.tr("err_max_length", 12),
                minLength: this.tr("err_min_length", 9),
                required: this.tr("err_required"),
                type: this.tr("err_phone"),
            },
        };
    }

    public render() {
        const { message, validationErrors, showLoader, mobile } = this.state;
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};
        const alert = message ? <Alert type="info">{message}</Alert> : null;

        return (
            <div className="page forget-page has-navbar page-logo-form">
                <Preloader show={showLoader} />
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/vesta-logo.png" alt="Vesta Logo" />
                    </div>
                </div>
                <FormWrapper name="ForgetForm" onSubmit={this.onSubmit}>
                    <FormTextInput name="mobile" label={this.tr("fld_mobile")} value={mobile} type="tel"
                        error={errors.mobile} placeholder={true} onChange={this.onChange} />
                    {alert}
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr("send_reset")}</button>
                        <Link to="/" className="btn btn-outline">{this.tr("login")}</Link>
                    </div>
                </FormWrapper>
            </div>
        );
    }

    private onChange = (name: string, value: string) => {
        this.setState({ mobile: value });
    }

    private onSubmit = () => {
        const user = new User({ mobile: this.state.mobile });
        const validationErrors = user.validate("mobile");
        if (validationErrors) {
            return this.setState({ validationErrors });
        }
        this.setState({ showLoader: true, validationErrors: null });
        this.api.post<IUser>("account/forget", { mobile: this.state.mobile })
            .then((response) => {
                this.setState({ showLoader: false });
                this.notif.success(this.tr("info_forget"));
                this.props.history.push("/");
            })
            .catch((error) => {
                this.setState({ showLoader: false, validationErrors: error.violations });
            });
    }
}

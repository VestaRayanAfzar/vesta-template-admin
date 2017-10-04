import React from "react";
import {Link} from "react-router-dom";
import {AuthService} from "../../service/AuthService";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IUser} from "../../cmn/models/User";
import {Preloader} from "../general/Preloader";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";

export interface ForgetParams {
}

export interface ForgetProps extends PageComponentProps<ForgetParams> {
}

export interface ForgetState extends PageComponentState {
    showLoader: boolean;
    email: string;
    message: string;
}

export class Forget extends PageComponent<ForgetProps, ForgetState> {
    private auth: AuthService = AuthService.getInstance();

    constructor(props: ForgetProps) {
        super(props);
        this.state = {showLoader: false, email: '', message: ''};
    }

    private onChange = (name: string, value: string) => {
        this.setState({email: value});
    }

    private onSubmit = () => {
        this.setState({showLoader: true});
        this.api.post<IUser>('account/forget', {email: this.state.email})
            .then(response => {
                this.setState({message: this.tr.translate('info_forget')})
            })
            .catch(error => {
                this.notif.error(error.message);
            })
    }

    public render() {
        const tr = this.tr.translate;
        let message = this.state.message ? <p className="alert alert-info">{this.state.message}</p> : null;
        return <div className="page">
            <Preloader options={{show: this.state.showLoader}}/>
            <FormWrapper name="ForgetForm" onSubmit={this.onSubmit}>
                {message}
                <FormTextInput name="email" label={tr('fld_email')} value={this.state.email}
                               onChange={this.onChange}/>
                <div className="form-group btn-group">
                    <button type="submit" className="btn btn-primary">{tr('send_reset')}</button>
                    <Link to="login" className="btn btn-default">{tr('login')}</Link>
                </div>
            </FormWrapper>
        </div>
    }
}

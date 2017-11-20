import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {IQueryResult} from "../../cmn/core/ICRUDResult";
import {IValidationError} from "../../cmn/core/Validator";
import Navbar from "../general/Navbar";
import {Avatar} from "../general/Avatar";
import {IUser, User, UserGender} from "../../cmn/models/User";
import {FieldValidationMessage, ModelValidationMessage, Util} from "../../util/Util";
import {FormOption, FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import {FormSelect} from "../general/form/FormSelect";
import {Preloader} from "../general/Preloader";
import {IRole} from "../../cmn/models/Role";
import {FormDateTimeInput} from "../general/form/FormDateTimeInput";

export interface ProfileParams {
}

export interface ProfileProps extends PageComponentProps<ProfileParams> {
}

export interface ProfileState extends PageComponentState {
    user: IUser;
    validationErrors: IValidationError;
    showLoader: boolean;
    imagePreview: string;
}

export class Profile extends PageComponent<ProfileProps, ProfileState> {

    constructor(props: ProfileProps) {
        super(props);
        let user = Util.shallowClone(this.auth.getUser());
        user.role = (user.role as IRole).id;
        this.state = {
            user,
            validationErrors: null,
            showLoader: false,
            imagePreview: null,
        };
    }


    private updateImage = (e) => {
        let files = e.target.files;
        if (files.length) {
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                this.setState({imagePreview: reader.result});
            }
            reader.readAsDataURL(file);
            this.onChange('image', files[0]);
        }
    }

    private updateUser(response: IQueryResult<IUser>) {
        const newUser = response.items[0];
        newUser.role = this.auth.getUser().role;
        this.auth.login(newUser);
        // removing user password from state
        delete this.state.user.password;
        delete this.state.user['confPassword'];
        this.setState({user: this.state.user});
    }

    private onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({user: this.state.user});
    }

    private onSubmit = () => {
        let {user, imagePreview} = this.state;
        if (user.password && user.password != user['confPassword']) {
            return this.setState({validationErrors: {password: 'conf'}});
        }
        let userModel = new User(this.state.user);
        let validationErrors = userModel.validate();
        if (validationErrors) {
            if (!user.password) {
                delete validationErrors.password;
            }
            if (Object.keys(validationErrors).length) {
                return this.setState({validationErrors});
            }
        }
        let hasImage = false
        let userImage: IUser = {};
        if (imagePreview) {
            userImage.image = userModel.image;
            delete userModel.image;
            hasImage = true
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.put<IUser>('user', userModel.getValues())
            .then(response => {
                if (!hasImage) {
                    this.setState({showLoader: false});
                    return this.updateUser(response);
                }
                this.api.upload<IUser>('user/file', userModel.id, userImage)
                    .then(response => {
                        this.setState({showLoader: false});
                        this.updateUser(response);
                    })
            })
            .catch(error => {
                this.setState({showLoader: false, validationErrors: error.violations});
                this.notif.error(error.message);
            })
    }

    public render() {
        const {showLoader, validationErrors, imagePreview} = this.state;
        const user = Util.shallowClone(this.state.user);
        let userImage = null;
        if (user.image) {
            userImage = Util.getFileUrl(`user/${user.image}`);
        }
        const requiredErrorMessage = this.tr('err_required');
        const formErrorsMessages: ModelValidationMessage = {
            firstName: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 2),
                maxLength: this.tr('err_max_length', 64)
            },
            lastName: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 2),
                maxLength: this.tr('err_max_length', 64)
            },
            email: {
                type: this.tr('err_email')
            },
            password: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 4),
                conf: this.tr('not_equal')
            },
            birthDate: {
                timestamp: this.tr('err_date')
            },
            gender: {
                enum: this.tr('err_enum')
            },
            image: {
                maxSize: this.tr('err_file_size', 6144),
                fileType: this.tr('err_file_type')
            }
        };
        const genderOptions: Array<FormOption> = [
            {value: UserGender.Male, title: this.tr('enum_male')},
            {value: UserGender.Female, title: this.tr('enum_female')}];
        const errors: FieldValidationMessage = validationErrors ? Util.validationMessage(formErrorsMessages, validationErrors) : {};

        return (
            <div className="page profile-page has-navbar">
                <Navbar title={this.tr('profile')} backLink="/"/>
                <Preloader show={showLoader}/>
                <FormWrapper onSubmit={this.onSubmit}>
                    <div className="avatar-wrapper">
                        <Avatar src={imagePreview ? imagePreview : userImage as string}
                                defaultSrc="img/vesta-logo.png">
                            <button className="change-image">{this.tr('txt_change_image')}</button>
                            <input className="change-image" type="file" name="image" onChange={this.updateImage}/>
                        </Avatar>
                        <h2>{user.username}</h2>
                        <p>{user.mobile}</p>
                    </div>

                    <fieldset className="profile-form">
                        <FormTextInput name="firstName" label={this.tr('fld_firstname')} value={user.firstName}
                                       placeholder={true} error={errors.firstName} onChange={this.onChange}/>
                        <FormTextInput name="lastName" label={this.tr('fld_lastname')} value={user.lastName}
                                       placeholder={true} error={errors.lastName} onChange={this.onChange}/>
                        <FormTextInput name="email" label={this.tr('fld_email')} value={user.email} placeholder={true}
                                       error={errors.email} onChange={this.onChange} type="email" dir="ltr"/>
                        <FormSelect name="gender" label={this.tr('fld_gender')} value={user.gender} placeholder={true}
                                    error={errors.gender} onChange={this.onChange} options={genderOptions}/>
                        <FormDateTimeInput name="birthDate" label={this.tr('fld_birth_date')} value={user.birthDate}
                                           placeholder={true} error={errors.birthDate} onChange={this.onChange}/>
                    </fieldset>

                    <fieldset className="profile-form">
                        <legend>{this.tr('txt_change_pass')}</legend>
                        <FormTextInput name="password" label={this.tr('fld_password')} value={user.password}
                                       placeholder={true} error={errors.password} onChange={this.onChange}
                                       type="password"/>
                        <FormTextInput name="confPassword" label={this.tr('fld_conf_password')} placeholder={true}
                                       value={user['confPassword']} onChange={this.onChange} type="password"/>
                    </fieldset>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr('update')}</button>
                    </div>
                </FormWrapper>
            </div>
        )
    }
}

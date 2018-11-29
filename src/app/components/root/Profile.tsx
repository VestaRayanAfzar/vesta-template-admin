import { IResponse, IValidationError } from "@vesta/core";
import React from "react";
import { IRole } from "../../cmn/models/Role";
import { IUser, User, UserGender } from "../../cmn/models/User";
import { getFileUrl, IModelValidationMessage, shallowClone, validationMessage } from "../../util/Util";
import { Avatar } from "../general/Avatar";
import { DateTimeInput } from "../general/form/DateTimeInput";
import { FormWrapper, IFormOption } from "../general/form/FormWrapper";
import { Select } from "../general/form/Select";
import { TextInput } from "../general/form/TextInput";
import Navbar from "../general/Navbar";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface IProfileParams {
}

interface IProfileProps extends IPageComponentProps<IProfileParams> {
}

interface IProfileState {
    imagePreview: string;
    user: IUser;
    validationErrors?: IValidationError;
}

export class Profile extends PageComponent<IProfileProps, IProfileState> {
    private formErrorsMessages: IModelValidationMessage;
    private genderOptions: IFormOption[] = [
        { id: UserGender.Male, title: this.tr("enum_male") },
        { id: UserGender.Female, title: this.tr("enum_female") }];

    constructor(props: IProfileProps) {
        super(props);
        const user = shallowClone(this.auth.getUser());
        user.role = (user.role as IRole).id;
        this.state = { user, imagePreview: null };
        this.formErrorsMessages = {
            birthDate: {
                timestamp: this.tr("err_date"),
            },
            email: {
                type: this.tr("err_email"),
            },
            firstName: {
                maxLength: this.tr("err_max_length", 64),
                minLength: this.tr("err_min_length", 2),
                required: this.tr("err_required"),
            },
            gender: {
                enum: this.tr("err_enum"),
            },
            image: {
                fileType: this.tr("err_file_type"),
                maxSize: this.tr("err_file_size", 6144),
            },
            lastName: {
                maxLength: this.tr("err_max_length", 64),
                minLength: this.tr("err_min_length", 2),
                required: this.tr("err_required"),
            },
            password: {
                conf: this.tr("not_equal"),
                minLength: this.tr("err_min_length", 4),
                required: this.tr("err_required"),
            },
        };
    }

    public render() {
        const { validationErrors, imagePreview } = this.state;
        const user = shallowClone(this.state.user);
        let userImage = null;
        if (user.image && "string" == typeof user.image) {
            userImage = getFileUrl(`user/${user.image}`);
        }
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};

        return (
            <div className="page profile-page has-navbar">
                <Navbar title={this.tr("profile")} backLink="/" />
                <FormWrapper onSubmit={this.onSubmit}>
                    <div className="avatar-wrapper">
                        <Avatar src={imagePreview ? imagePreview : userImage as string}
                            defaultSrc="img/icons/144x144.png">
                            <button className="change-image" type="button">{this.tr("txt_change_image")}</button>
                            <input className="change-image" type="file" name="image" onChange={this.updateImage} />
                        </Avatar>
                        <h2>{user.username}</h2>
                        <p>{user.mobile}</p>
                    </div>

                    <fieldset className="profile-form">
                        <TextInput name="firstName" label={this.tr("fld_firstname")} value={user.firstName}
                            placeholder={true} error={errors.firstName} onChange={this.onChange} />
                        <TextInput name="lastName" label={this.tr("fld_lastname")} value={user.lastName}
                            placeholder={true} error={errors.lastName} onChange={this.onChange} />
                        <TextInput name="email" label={this.tr("fld_email")} value={user.email} placeholder={true}
                            error={errors.email} onChange={this.onChange} type="email" dir="ltr" />
                        <Select name="gender" label={this.tr("fld_gender")} value={user.gender} placeholder={true}
                            error={errors.gender} onChange={this.onChange} options={this.genderOptions} />
                        <DateTimeInput name="birthDate" label={this.tr("fld_birth_date")} value={user.birthDate}
                            placeholder={true} error={errors.birthDate} onChange={this.onChange} />
                    </fieldset>

                    <fieldset className="profile-form">
                        <legend>{this.tr("txt_change_pass")}</legend>
                        <TextInput name="password" label={this.tr("fld_password")} value={user.password}
                            placeholder={true} error={errors.password} onChange={this.onChange}
                            type="password" />
                        <TextInput name="confPassword" label={this.tr("fld_conf_password")} placeholder={true}
                            value={(user as any).confPassword} onChange={this.onChange} type="password" />
                    </fieldset>

                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr("update")}</button>
                    </div>
                </FormWrapper>
            </div>
        );
    }

    private onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({ user: this.state.user });
    }

    private onSubmit = () => {
        const { user, imagePreview } = this.state;
        if (user.password && user.password != (user as any).confPassword) {
            return this.setState({ validationErrors: { password: "conf" } });
        }
        const userModel = new User(this.state.user);
        const validationErrors = userModel.validate();
        if (validationErrors) {
            if (!user.password) {
                delete validationErrors.password;
            }
            if (Object.keys(validationErrors).length) {
                return this.setState({ validationErrors });
            }
        }
        let hasImage = false;
        const userImage: IUser = {};
        if (imagePreview) {
            userImage.image = userModel.image;
            delete userModel.image;
            hasImage = true;
        }
        Preloader.show();
        this.setState({ validationErrors: null });
        this.api.put<IUser>("user", userModel.getValues())
            .then((response) => {
                if (!hasImage) {
                    Preloader.hide();
                    return this.updateUser(response);
                }
                return this.api.upload<IUser>(`user/file/${userModel.id}`, userImage)
                    .then((uplResponse) => {
                        Preloader.hide();
                        this.updateUser(uplResponse);
                    });
            })
            .catch((error) => {
                Preloader.hide();
                this.setState({ validationErrors: error.violations });
                this.notif.error(error.message);
            });
    }

    private updateImage = (e) => {
        const files = e.target.files;
        if (files.length) {
            const reader = new FileReader();
            const file = e.target.files[0];
            reader.onloadend = () => {
                this.setState({ imagePreview: reader.result as string });
            };
            reader.readAsDataURL(file);
            this.onChange("image", files[0]);
        }
    }

    private updateUser(response: IResponse<IUser>) {
        const { user } = this.state;
        const newUser = response.items[0];
        newUser.role = this.auth.getUser().role;
        this.auth.login(newUser);
        // removing user password from state
        delete user.password;
        delete (user as any).confPassword;
        this.setState({ user: this.state.user });
        this.notif.success("msg_profile_update");
    }
}

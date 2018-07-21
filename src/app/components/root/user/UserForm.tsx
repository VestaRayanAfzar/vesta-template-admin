import React from "react";
import { Status } from "../../../cmn/enum/Status";
import { IRole } from "../../../cmn/models/Role";
import { IUser, UserGender, UserType } from "../../../cmn/models/User";
import { IValidationError } from "../../../medium";
import { getFileUrl, IModelValidationMessage, validationMessage } from "../../../util/Util";
import { FormDateTimeInput } from "../../general/form/FormDateTimeInput";
import { FormFileInput } from "../../general/form/FormFileInput";
import { FormMultichoice } from "../../general/form/FormMultichoice";
import { FormSelect } from "../../general/form/FormSelect";
import { FormTextInput } from "../../general/form/FormTextInput";
import { FormWrapper, IFormOption } from "../../general/form/FormWrapper";
import { FetchById, IPageComponentProps, PageComponent, Save } from "../../PageComponent";

interface IUserFormParams {
}

interface IUserFormProps extends IPageComponentProps<IUserFormParams> {
    fetch?: FetchById<IUser>;
    id?: number;
    roles: IRole[];
    save: Save<IUser>;
    validationErrors?: IValidationError;
}

interface IUserFormState {
    user: IUser;
}

export class UserForm extends PageComponent<IUserFormProps, IUserFormState> {
    private formErrorsMessages: IModelValidationMessage;
    private genderOptions: IFormOption[] = [
        { id: UserGender.Male, title: this.tr("enum_male") },
        { id: UserGender.Female, title: this.tr("enum_female") }];
    private statusOptions: IFormOption[] = [
        { id: Status.Active, title: this.tr("enum_active") },
        { id: Status.Inactive, title: this.tr("enum_inactive") }];
    private typeOptions: IFormOption[] = [
        { id: UserType.Admin, title: this.tr("enum_admin") },
        { id: UserType.User, title: this.tr("enum_user") }];
    // const dateTime = DateTimeFactory.create(ConfigService.getConfig().locale)

    constructor(props: IUserFormProps) {
        super(props);
        this.state = { user: {} };
        this.formErrorsMessages = {
            birthDate: {
                timestamp: this.tr("err_date"),
            },
            email: {
                email: this.tr("err_email"),
            },
            firstName: {
                maxLength: this.tr("err_max_length", 64),
                minLength: this.tr("err_min_length", 2),
                required: this.tr("err_required"),
            },
            gender: {
                enum: this.tr("err_enum"),
                required: this.tr("err_required"),
            },
            image: {
                fileType: this.tr("err_file_type"),
                maxSize: this.tr("err_file_size", 6144),
                required: this.tr("err_required"),
            },
            lastName: {
                maxLength: this.tr("err_max_length", 64),
                minLength: this.tr("err_min_length", 2),
                required: this.tr("err_required"),
            },
            mobile: {
                maxLength: this.tr("err_max_length", 12),
                minLength: this.tr("err_min_length", 9),
                required: this.tr("err_required"),
                type: this.tr("err_phone"),
            },
            password: {
                minLength: this.tr("err_min_length", 4),
                required: this.tr("err_required"),
            },
            role: {
                required: this.tr("err_required"),
            },
            status: {
                enum: this.tr("err_enum"),
                required: this.tr("err_required"),
            },
            type: {
                enum: this.tr("err_enum"),
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
        const id = +this.props.id;
        if (isNaN(id)) { return; }
        this.props.fetch(id)
            .then((user) => {
                if (user.image) {
                    user.image = getFileUrl(`user/${user.image}`);
                }
                this.setState({ user });
            });
    }

    public onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({ user: this.state.user });
    }

    public onSubmit = (e: Event) => {
        this.props.save(this.state.user);
    }

    public render() {
        const { validationErrors, roles } = this.props;
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};
        const user = this.state.user;
        const roleId = user.role && (user.role as IRole).id;

        return (
            <FormWrapper name="userForm" onSubmit={this.onSubmit}>
                <FormMultichoice name="type" label={this.tr("fld_type")} value={user.type}
                    error={errors.type} onChange={this.onChange} options={this.typeOptions} />
                <FormSelect name="role" label={this.tr("role")} options={roles} value={roleId} placeholder={true}
                    error={errors.role} onChange={this.onChange} titleKey="name" valueKey="id" />
                <FormTextInput name="username" label={this.tr("fld_username")} value={user.username} placeholder={true}
                    error={errors.username} onChange={this.onChange} />
                <FormTextInput name="firstName" label={this.tr("fld_firstname")} value={user.firstName}
                    placeholder={true} error={errors.firstName} onChange={this.onChange} />
                <FormTextInput name="lastName" label={this.tr("fld_lastname")} value={user.lastName}
                    placeholder={true} error={errors.lastName} onChange={this.onChange} />
                <FormTextInput name="email" label={this.tr("fld_email")} value={user.email} placeholder={true}
                    error={errors.email} onChange={this.onChange} type="email" />
                <FormTextInput name="mobile" label={this.tr("fld_mobile")} value={user.mobile} placeholder={true}
                    error={errors.mobile} onChange={this.onChange} />
                <FormTextInput name="password" label={this.tr("fld_password")} value={user.password} placeholder={true}
                    error={errors.password} onChange={this.onChange} type="password" />
                <FormDateTimeInput name="birthDate" label={this.tr("fld_birthDate")} value={user.birthDate}
                    error={errors.birthDate} onChange={this.onChange} placeholder={true} />
                <FormSelect name="gender" label={this.tr("fld_gender")} value={user.gender} placeholder={true}
                    error={errors.gender} onChange={this.onChange} options={this.genderOptions} />
                <FormFileInput name="image" label={this.tr("fld_image")} value={user.image} placeholder={true}
                    error={errors.image} onChange={this.onChange} />
                <FormSelect name="status" label={this.tr("fld_status")} value={user.status} placeholder={true}
                    error={errors.status} onChange={this.onChange} options={this.statusOptions} />
                {this.props.children}
            </FormWrapper>
        );
    }
}

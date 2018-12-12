import { DateTimeInput, FileInput, FormWrapper, IFormOption, Multichoice, Select, TextInput } from "@vesta/components";
import { IValidationError } from "@vesta/core";
import React from "react";
import { Status } from "../../../cmn/enum/Status";
import { IRole } from "../../../cmn/models/Role";
import { IUser, User, UserGender, UserType } from "../../../cmn/models/User";
import { ModelService } from "../../../service/ModelService";
import { getFileUrl, IModelValidationMessage, validationMessage } from "../../../util/Util";
import { IBaseComponentProps } from "../../BaseComponent";
import { PageComponent } from "../../PageComponent";

interface IUserFormProps extends IBaseComponentProps {
    id?: number;
    goBack?: () => void;
}

interface IUserFormState {
    user: IUser;
    roles: IRole[];
    validationErrors?: IValidationError;
}

export class UserForm extends PageComponent<IUserFormProps, IUserFormState> {
    private service = ModelService.getService<IUser>("user");
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

    constructor(props: IUserFormProps) {
        super(props);
        this.state = { user: {}, roles: [] };
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
        this.service.fetch(id)
            .then((user) => {
                if (user.image) {
                    user.image = getFileUrl(`user/${user.image}`);
                }
                this.setState({ user });
            });
    }

    public render() {
        const { validationErrors, roles } = this.state;
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};
        const user = this.state.user;
        const roleId = user.role && (user.role as IRole).id;

        return (
            <FormWrapper name="userForm" onSubmit={this.onSubmit}>
                <Multichoice name="type" label={this.tr("fld_type")} value={user.type}
                    error={errors.type} onChange={this.onChange} options={this.typeOptions} />
                <Select name="role" label={this.tr("role")} options={roles} value={roleId}
                    error={errors.role} onChange={this.onChange} titleKey="name" valueKey="id" />
                <TextInput name="username" label={this.tr("fld_username")} value={user.username}
                    error={errors.username} onChange={this.onChange} />
                <TextInput name="firstName" label={this.tr("fld_firstname")} value={user.firstName}
                    error={errors.firstName} onChange={this.onChange} />
                <TextInput name="lastName" label={this.tr("fld_lastname")} value={user.lastName}
                    error={errors.lastName} onChange={this.onChange} />
                <TextInput name="email" label={this.tr("fld_email")} value={user.email}
                    error={errors.email} onChange={this.onChange} type="email" />
                <TextInput name="mobile" label={this.tr("fld_mobile")} value={user.mobile}
                    error={errors.mobile} onChange={this.onChange} />
                <TextInput name="password" label={this.tr("fld_password")} value={user.password}
                    error={errors.password} onChange={this.onChange} type="password" />
                <DateTimeInput name="birthDate" label={this.tr("fld_birthDate")} value={user.birthDate}
                    error={errors.birthDate} onChange={this.onChange} />
                <Select name="gender" label={this.tr("fld_gender")} value={user.gender}
                    error={errors.gender} onChange={this.onChange} options={this.genderOptions} />
                <FileInput name="image" label={this.tr("fld_image")} value={user.image}
                    error={errors.image} onChange={this.onChange} />
                <Select name="status" label={this.tr("fld_status")} value={user.status}
                    error={errors.status} onChange={this.onChange} options={this.statusOptions} />
                {this.props.children}
            </FormWrapper>
        );
    }

    public onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({ user: this.state.user });
    }

    public onSubmit = () => {
        const { user } = this.state;
        const userModel = new User(user);
        const userFiles: IUser = {};
        const validationResult = userModel.validate();
        if (validationResult) {
            if (!userModel.password) {
                delete validationResult.password;
            }
            if (Object.keys(validationResult).length) {
                return Promise.reject(validationResult);
            }
        }
        let hasFile = false;
        if (userModel.image) {
            userFiles.image = userModel.image;
            delete userModel.image;
            hasFile = true;
        }
        this.service.save(userModel.getValues(), hasFile ? userFiles : null);
    }
}

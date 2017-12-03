import React from "react";
import {FetchById, PageComponent, PageComponentProps, Save} from "../../PageComponent";
import {FieldValidationMessage, getFileUrl, ModelValidationMessage, validationMessage} from "../../../util/Util";
import {FormOption, FormWrapper} from "../../general/form/FormWrapper";
import {IUser, UserGender, UserType} from "../../../cmn/models/User";
import {IRole} from "../../../cmn/models/Role";
import {Status} from "../../../cmn/enum/Status";
import {FormSelect} from "../../general/form/FormSelect";
import {FormTextInput} from "../../general/form/FormTextInput";
import {FormFileInput} from "../../general/form/FormFileInput";
import {FormTextArea} from "../../general/form/FormTextArea";
import {IValidationError} from "../../../cmn/core/Validator";
import {FormMultichoice} from "../../general/form/FormMultichoice";
import {FormDateTimeInput} from "../../general/form/FormDateTimeInput";

export interface UserFormParams {
}

export interface UserFormProps extends PageComponentProps<UserFormParams> {
    id?: number;
    fetch?: FetchById<IUser>;
    save: Save<IUser>;
    validationErrors: IValidationError;
    roles: Array<IRole>;
}

export interface UserFormState {
    user: IUser;
}

export class UserForm extends PageComponent<UserFormProps, UserFormState> {

    constructor(props: UserFormProps) {
        super(props);
        this.state = {user: {}};
    }

    public componentDidMount() {
        const id = +this.props.id;
        if (isNaN(id)) return;
        this.props.fetch(id)
            .then(user => {
                if (user.image) {
                    user.image = getFileUrl(`user/${user.image}`);
                }
                this.setState({user});
            });
    }

    public onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({user: this.state.user});
    }

    public onSubmit = (e: Event) => {
        this.props.save(this.state.user);
    }

    public render() {
        const requiredErrorMessage = this.tr('err_required');
        const formErrorsMessages: ModelValidationMessage = {
            type: {
                required: requiredErrorMessage,
                enum: this.tr('err_enum')
            },
            username: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 4),
                maxLength: this.tr('err_max_length', 16)
            },
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
                email: this.tr('err_email')
            },
            mobile: {
                required: requiredErrorMessage,
                type: this.tr('err_phone'),
                minLength: this.tr('err_min_length', 9),
                maxLength: this.tr('err_max_length', 12)
            },
            password: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 4)
            },
            birthDate: {
                timestamp: this.tr('err_date')
            },
            gender: {
                required: requiredErrorMessage,
                enum: this.tr('err_enum')
            },
            image: {
                required: requiredErrorMessage,
                maxSize: this.tr('err_file_size', 6144),
                fileType: this.tr('err_file_type')
            },
            status: {
                required: requiredErrorMessage,
                enum: this.tr('err_enum')
            },
            role: {
                required: requiredErrorMessage
            }
        };
        const {validationErrors, roles} = this.props;
        const errors: FieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
        const typeOptions: Array<FormOption> = [
            {value: UserType.Admin, title: this.tr('enum_admin')},
            {value: UserType.User, title: this.tr('enum_user')}];
        // const dateTime = DateTimeFactory.create(ConfigService.getConfig().locale)
        const genderOptions: Array<FormOption> = [
            {value: UserGender.Male, title: this.tr('enum_male')},
            {value: UserGender.Female, title: this.tr('enum_female')}];
        const statusOptions: Array<FormOption> = [
            {value: Status.Active, title: this.tr('enum_active')},
            {value: Status.Inactive, title: this.tr('enum_inactive')}];

        const user = this.state.user;
        const roleId = user.role && (user.role as IRole).id;

        return (
            <FormWrapper name="userForm" onSubmit={this.onSubmit}>
                <FormMultichoice name="type" label={this.tr('fld_type')} value={user.type}
                                 error={errors.type} onChange={this.onChange} options={typeOptions}/>
                <FormSelect name="role" label={this.tr('fld_role')} options={roles} value={roleId} placeholder={true}
                            error={errors.role} onChange={this.onChange} titleKey="name" valueKey="id"/>
                <FormTextInput name="username" label={this.tr('fld_username')} value={user.username} placeholder={true}
                               error={errors.username} onChange={this.onChange}/>
                <FormTextInput name="firstName" label={this.tr('fld_firstname')} value={user.firstName}
                               placeholder={true} error={errors.firstName} onChange={this.onChange}/>
                <FormTextInput name="lastName" label={this.tr('fld_lastname')} value={user.lastName}
                               placeholder={true} error={errors.lastName} onChange={this.onChange}/>
                <FormTextInput name="email" label={this.tr('fld_email')} value={user.email} placeholder={true}
                               error={errors.email} onChange={this.onChange} type="email"/>
                <FormTextInput name="mobile" label={this.tr('fld_mobile')} value={user.mobile} placeholder={true}
                               error={errors.mobile} onChange={this.onChange}/>
                <FormTextInput name="password" label={this.tr('fld_password')} value={user.password} placeholder={true}
                               error={errors.password} onChange={this.onChange} type="password"/>
                <FormDateTimeInput name="birthDate" label={this.tr('fld_birthDate')} value={user.birthDate}
                                   error={errors.birthDate} onChange={this.onChange} placeholder={true}/>
                <FormSelect name="gender" label={this.tr('fld_gender')} value={user.gender} placeholder={true}
                            error={errors.gender} onChange={this.onChange} options={genderOptions}/>
                <FormFileInput name="image" label={this.tr('fld_image')} value={user.image} placeholder={true}
                               error={errors.image} onChange={this.onChange}/>
                <FormSelect name="status" label={this.tr('fld_status')} value={user.status} placeholder={true}
                            error={errors.status} onChange={this.onChange} options={statusOptions}/>
                {this.props.children}
            </FormWrapper>
        )
    }
}

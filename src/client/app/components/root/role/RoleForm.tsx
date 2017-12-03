import React, {Component} from "react";
import {FetchById, PageComponentProps, PageComponentState, Save} from "../../PageComponent";
import {FieldValidationMessage, ModelValidationMessage, validationMessage} from "../../../util/Util";
import {TranslateService} from "../../../service/TranslateService";
import {FormOption, FormWrapper} from "../../general/form/FormWrapper";
import {IRole} from "../../../cmn/models/Role";
import {Status} from "../../../cmn/enum/Status";
import {FormTextInput} from "../../general/form/FormTextInput";
import {FormSelect} from "../../general/form/FormSelect";
import {IAction, IExtPermission} from "../Role";
import {FormMultichoice} from "../../general/form/FormMultichoice";
import {IValidationError} from "../../../cmn/core/Validator";
import {IPermission} from "../../../cmn/models/Permission";

export interface RoleFormParams {
    id?: number;
}

export interface IPermissionCollection {
    [name: string]: Array<number>;
}

export interface RoleFormProps extends PageComponentProps<RoleFormParams> {
    save: Save<IRole>;
    fetch?: FetchById<IRole>;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export interface RoleFormState extends PageComponentState {
    role: IRole;
}

export class RoleForm extends Component<RoleFormProps, RoleFormState> {
    private permissions: IPermissionCollection = {};

    constructor(props: RoleFormProps) {
        super(props);
        this.state = {role: {permissions: []}};
    }

    public componentDidMount() {
        const id = +this.props.match.params.id;
        if (isNaN(id)) return;
        this.props.fetch(id)
            .then(role => {
                const {permissions} = this.props;
                // extracting permissions from role.permissions to permissions
                let resources = Object.keys(permissions);
                for (let i = resources.length; i--;) {
                    let resource = resources[i];
                    let actions = permissions[resource].map((a: IAction) => a.id);
                    let rolePermissions = role.permissions.map((p: IPermission) => p.id);
                    for (let j = rolePermissions.length; j--;) {
                        if (actions.indexOf(rolePermissions[j]) >= 0) {
                            if (!this.permissions[resource]) {
                                this.permissions[resource] = [];
                            }
                            this.permissions[resource].push(rolePermissions[j]);
                        }
                    }
                }
                this.setState({role});
            });
    }

    private getAllPermissionsValue() {
        let values = [];
        let names = Object.keys(this.permissions);
        for (let i = names.length; i--;) {
            values = values.concat(this.permissions[names[i]]);
        }
        return values;
    }

    private onFormChange = (name: string, value: any) => {
        this.state.role[name] = value;
        this.setState({role: this.state.role});
    }

    private onPermissionChange = (name: string, value: any) => {
        this.permissions[name] = value;
        this.state.role.permissions = this.getAllPermissionsValue();
        this.setState({role: this.state.role});
    }

    private onSubmit = (e: Event) => {
        this.props.save(this.state.role);
    }

    private renderPermissionTable() {
        let resources = Object.keys(this.props.permissions);
        if (!resources.length) return null;
        let values = this.getAllPermissionsValue();
        let rows = [];
        for (let i = resources.length; i--;) {
            let resource = resources[i];
            let actions = this.props.permissions[resource];
            let options = actions.map(action => {
                return {title: action.action, value: action.id}
            })
            rows.push(
                <li key={i}>
                    <FormMultichoice name={resource} label={resource} value={values} onChange={this.onPermissionChange}
                                     options={options}/>
                </li>);
        }
        return rows;
    }

    public render() {
        let {validationErrors} = this.props;
        const tr = TranslateService.getInstance().translate;
        const formErrorsMessages: ModelValidationMessage = {
            name: {
                required: tr('err_required')
            },
            status: {
                required: tr('err_required'),
                enum: tr('err_enum')
            }
        };
        let errors: FieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
        const statusOptions: Array<FormOption> = [
            {value: Status.Active, title: tr('enum_active')},
            {value: Status.Inactive, title: tr('enum_inactive')}];

        let role = this.state.role;
        const rows = this.renderPermissionTable();
        return (
            <FormWrapper name="roleAddForm" onSubmit={this.onSubmit}>
                <div className="roleForm-component">
                    <FormTextInput name="name" label={tr('fld_name')} value={role.name} placeholder={true}
                                   error={errors.name} onChange={this.onFormChange}/>
                    <FormTextInput name="desc" label={tr('fld_desc')} value={role.desc} placeholder={true}
                                   error={errors.desc} onChange={this.onFormChange}/>
                    <FormSelect name="status" label={tr('fld_status')} value={role.status} placeholder={true}
                                error={errors.status} onChange={this.onFormChange} options={statusOptions}/>
                    <div className="form-group">
                        <ul className="permission-list">
                            {rows}
                        </ul>
                    </div>
                    {this.props.children}
                </div>
            </FormWrapper>
        )

    }
}

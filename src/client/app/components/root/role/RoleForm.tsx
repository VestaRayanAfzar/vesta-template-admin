import React, { Component } from "react";
import { Status } from "../../../cmn/enum/Status";
import { IPermission } from "../../../cmn/models/Permission";
import { IRole } from "../../../cmn/models/Role";
import { IValidationError } from "../../../medium";
import { TranslateService } from "../../../service/TranslateService";
import { IModelValidationMessage, validationMessage } from "../../../util/Util";
import { FormMultichoice } from "../../general/form/FormMultichoice";
import { FormSelect } from "../../general/form/FormSelect";
import { FormTextInput } from "../../general/form/FormTextInput";
import { FormWrapper, IFormOption } from "../../general/form/FormWrapper";
import { FetchById, IPageComponentProps, Save } from "../../PageComponent";
import { IAction, IExtPermission } from "../Role";

export interface IRoleFormParams {
}

export interface IPermissionCollection {
    [name: string]: Array<number>;
}

export interface IRoleFormProps extends IPageComponentProps<IRoleFormParams> {
    fetch?: FetchById<IRole>;
    id?: number;
    permissions: IExtPermission;
    save: Save<IRole>;
    validationErrors: IValidationError;
}

export interface IRoleFormState {
    role: IRole;
}

export class RoleForm extends Component<IRoleFormProps, IRoleFormState> {
    private permissions: IPermissionCollection = {};

    constructor(props: IRoleFormProps) {
        super(props);
        this.state = { role: { permissions: [] } };
    }

    public componentDidMount() {
        const id = +this.props.id;
        if (isNaN(id)) { return; }
        this.props.fetch(id)
            .then((role) => {
                const { permissions } = this.props;
                // extracting permissions from role.permissions to permissions
                const resources = Object.keys(permissions);
                for (let i = resources.length; i--;) {
                    const resource = resources[i];
                    const actions = permissions[resource].map((a: IAction) => a.id);
                    const rolePermissions = role.permissions.map((p: IPermission) => p.id);
                    for (let j = rolePermissions.length; j--;) {
                        if (actions.indexOf(rolePermissions[j]) >= 0) {
                            if (!this.permissions[resource]) {
                                this.permissions[resource] = [];
                            }
                            this.permissions[resource].push(rolePermissions[j]);
                        }
                    }
                }
                this.setState({ role });
            });
    }

    public render() {
        const { validationErrors } = this.props;
        const tr = TranslateService.getInstance().translate;
        const formErrorsMessages: IModelValidationMessage = {
            name: {
                required: tr("err_required"),
            },
            status: {
                enum: tr("err_enum"),
                required: tr("err_required"),
            },
        };
        const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
        const statusOptions: Array<IFormOption> = [
            { id: Status.Active, title: tr("enum_active") },
            { id: Status.Inactive, title: tr("enum_inactive") }];

        const role = this.state.role;
        const rows = this.renderPermissionTable();
        return (
            <FormWrapper name="roleAddForm" onSubmit={this.onSubmit}>
                <div className="roleForm-component">
                    <FormTextInput name="name" label={tr("fld_name")} value={role.name} placeholder={true}
                        error={errors.name} onChange={this.onFormChange} />
                    <FormTextInput name="desc" label={tr("fld_desc")} value={role.desc} placeholder={true}
                        error={errors.desc} onChange={this.onFormChange} />
                    <FormSelect name="status" label={tr("fld_status")} value={role.status} placeholder={true}
                        titleKey="title" error={errors.status} onChange={this.onFormChange}
                        options={statusOptions} />
                    <div className="form-group">
                        <ul className="permission-list">
                            {rows}
                        </ul>
                    </div>
                    {this.props.children}
                </div>
            </FormWrapper>
        );

    }

    private getAllPermissionsValue() {
        let values = [];
        const names = Object.keys(this.permissions);
        for (let i = names.length; i--;) {
            values = values.concat(this.permissions[names[i]]);
        }
        return values;
    }

    private onFormChange = (name: string, value: any) => {
        this.state.role[name] = value;
        this.setState({ role: this.state.role });
    }

    private onPermissionChange = (name: string, value: any) => {
        if (!value) {
            delete this.permissions[name];
        } else {
            this.permissions[name] = value;
        }
        this.state.role.permissions = this.getAllPermissionsValue();
        this.setState({ role: this.state.role });
    }

    private onSubmit = (e: Event) => {
        this.props.save(this.state.role);
    }

    private renderPermissionTable() {
        const resources = Object.keys(this.props.permissions);
        if (!resources.length) { return null; }
        const rows = [];
        for (let i = resources.length; i--;) {
            const resource = resources[i];
            const actions = this.props.permissions[resource];
            const values = this.permissions[resource];
            rows.push(
                <li key={i}>
                    <FormMultichoice name={resource} label={resource} value={values} onChange={this.onPermissionChange}
                        options={actions} titleKey="action" />
                </li>);
        }
        return rows;
    }
}

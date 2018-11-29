import { Culture, IValidationError } from "@vesta/core";
import React, { Component } from "react";
import { Status } from "../../../cmn/enum/Status";
import { IPermission } from "../../../cmn/models/Permission";
import { IRole, Role } from "../../../cmn/models/Role";
import { ModelService } from "../../../service/ModelService";
import { IModelValidationMessage, validationMessage } from "../../../util/Util";
import { IBaseComponentProps } from "../../BaseComponent";
import { FormWrapper, IFormOption } from "../../general/form/FormWrapper";
import { Multichoice } from "../../general/form/Multichoice";
import { Select } from "../../general/form/Select";
import { TextInput } from "../../general/form/TextInput";
import { IAction, IExtPermission } from "../Role";

interface IPermissionCollection {
    [name: string]: number[];
}

interface IRoleFormProps extends IBaseComponentProps {
    id?: number;
    goBack: () => void;
}

interface IRoleFormState {
    role: IRole;
    permissions: IExtPermission;
    validationErrors?: IValidationError;
}

export class RoleForm extends Component<IRoleFormProps, IRoleFormState> {
    private tr = Culture.getDictionary().translate;
    private roleService = ModelService.getService<IRole>("acl/role");
    private permissionService = ModelService.getService<IPermission>("acl/permission");
    private permissions: IPermissionCollection = {};
    private formErrorsMessages: IModelValidationMessage;
    private statusOptions: IFormOption[] = [
        { id: Status.Active, title: this.tr("enum_active") },
        { id: Status.Inactive, title: this.tr("enum_inactive") }];

    constructor(props: IRoleFormProps) {
        super(props);
        this.state = { role: { permissions: [] }, permissions: {} };
        this.formErrorsMessages = {
            name: {
                required: this.tr("err_required"),
            },
            status: {
                enum: this.tr("err_enum"),
                required: this.tr("err_required"),
            },
        };
    }

    public componentDidMount() {
        let permissions = [];
        this.permissionService.fetchAll({})
            .then((items) => {
                permissions = items;
                const id = +this.props.id;
                if (isNaN(id)) { return null; }
                return this.roleService.fetch(id);
            })
            .then((role) => this.parsePermissions(permissions, role));
    }

    public render() {
        const { validationErrors } = this.state;

        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};

        const role = this.state.role;
        const rows = this.renderPermissionTable();

        return (
            <FormWrapper name="roleAddForm" onSubmit={this.onSubmit}>
                <div className="roleForm-component">
                    <TextInput name="name" label={this.tr("fld_name")} value={role.name} placeholder={true}
                        error={errors.name} onChange={this.onChange} />
                    <TextInput name="desc" label={this.tr("fld_desc")} value={role.desc} placeholder={true}
                        error={errors.desc} onChange={this.onChange} />
                    <Select name="status" label={this.tr("fld_status")} value={role.status} placeholder={true}
                        titleKey="title" error={errors.status} onChange={this.onChange}
                        options={this.statusOptions} />
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

    private onChange = (name: string, value: any) => {
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

    private onSubmit = () => {
        const { role } = this.state;
        this.roleService.submit(new Role(role))
            .then(this.props.goBack)
            .catch((error) => this.setState({ validationErrors: error.violations }));
    }

    private parsePermissions(inpPermissions: IPermission[], inpRole: IRole) {
        const { permissions, role } = this.state;
        inpRole = inpRole || role;
        // converting list of [{resource, action}] => {resource=> [actions]}
        for (let i = 0, il = inpPermissions.length; i < il; ++i) {
            const p: IPermission = inpPermissions[i] as IPermission;
            if (!permissions[p.resource]) {
                permissions[p.resource] = [];
            }
            permissions[p.resource].push({ id: p.id, action: p.action });
        }
        const resources = Object.keys(permissions);
        for (let i = resources.length; i--;) {
            const resource = resources[i];
            const actions = permissions[resource].map((a: IAction) => a.id);
            const rolePermissions = inpRole.permissions.map((p: IPermission) => p.id);
            for (let j = rolePermissions.length; j--;) {
                if (actions.indexOf(rolePermissions[j]) >= 0) {
                    if (!this.permissions[resource]) {
                        this.permissions[resource] = [];
                    }
                    this.permissions[resource].push(rolePermissions[j]);
                }
            }
        }
        this.setState({ role: inpRole, permissions });
    }

    private renderPermissionTable() {
        const { permissions } = this.state;
        const resources = Object.keys(permissions);
        if (!resources.length) { return null; }
        const rows = [];
        for (let i = resources.length; i--;) {
            const resource = resources[i];
            const actions = permissions[resource];
            const values = this.permissions[resource];
            rows.push(
                <li key={i}>
                    <Multichoice name={resource} label={resource} value={values} onChange={this.onPermissionChange}
                        options={actions} titleKey="action" />
                </li>);
        }
        return rows;
    }
}

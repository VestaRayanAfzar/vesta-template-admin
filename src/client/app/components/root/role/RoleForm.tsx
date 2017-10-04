import React from "react";
import {PageComponentProps} from "../../PageComponent";
import {IValidationError} from "../../../medium";
import {FieldValidationMessage, ModelValidationMessage, Util} from "../../../util/Util";
import {TranslateService} from "../../../service/TranslateService";
import {ChangeEventHandler, FormOption} from "../../general/form/FormWrapper";
import {IRole} from "../../../cmn/models/Role";
import {Status} from "../../../cmn/enum/Status";
import {FormTextInput} from "../../general/form/FormTextInput";
import {FormTextArea} from "../../general/form/FormTextArea";
import {FormSelect} from "../../general/form/FormSelect";
import {FormMultichoice} from "../../general/form/FormMultichoice";
import {IExtPermission} from "../Role";
import {IPermission} from "../../../cmn/models/Permission";

export interface RoleFormParams {
}

export interface RoleFormProps extends PageComponentProps<RoleFormParams> {
    role?: IRole;
    onChange: ChangeEventHandler;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export const RoleForm = (props: RoleFormProps) => {
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
    let errors: FieldValidationMessage = props.validationErrors ? Util.validationMessage(formErrorsMessages, props.validationErrors) : {};
    const statusOptions: Array<FormOption> = [
        {value: Status.Active, title: tr('enum_active')},
        {value: Status.Inactive, title: tr('enum_inactive')}];

    let role = props.role || {};
    const rows = renderPermissionTable();
    return <div className="roleForm-component">
        <FormTextInput name="name" label={tr('fld_name')} value={role.name}
                       error={errors.name} onChange={props.onChange}/>
        <FormTextArea name="desc" label={tr('fld_desc')} value={role.desc}
                      error={errors.desc} onChange={props.onChange}/>
        <FormSelect name="status" label={tr('fld_status')} value={role.status}
                    error={errors.status} onChange={props.onChange} options={statusOptions}/>
        <div className="form-group">
            <ul className="permission-list">
                {rows}
            </ul>
        </div>
    </div>;

    function renderPermissionTable() {
        let resources = Object.keys(props.permissions);
        if (!resources.length) return null;
        let values = [];
        if (props.role.id) {
            values = props.role.permissions.map((p: IPermission) => p.id);
        }
        let rows = [];
        for (let i = resources.length; i--;) {
            let resource = resources[i];
            let actions = props.permissions[resource];
            let options = actions.map(action => {
                return {title: action.action, value: action.id}
            })
            rows.push(<li key={i}>
                <FormMultichoice name={resource} label={resource} value={values} onChange={props.onChange}
                                 options={options}/>
            </li>);
        }
        return rows;
    }
}

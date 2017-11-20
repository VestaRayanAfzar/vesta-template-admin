import React from "react";
import {PageComponent, PageComponentProps, PageComponentState, Save} from "../../PageComponent";
import {RoleForm} from "./RoleForm";
import {IRole} from "../../../cmn/models/Role";
import {IExtPermission} from "../Role";
import {IValidationError} from "../../../cmn/core/Validator";

export interface RoleAddParams {
}

export interface RoleAddProps extends PageComponentProps<RoleAddParams> {
    save: Save<IRole>;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export interface RoleAddState extends PageComponentState {
}

export class RoleAdd extends PageComponent<RoleAddProps, RoleAddState> {

    public render() {
        return (
            <div className="crud-page">
                <h1>{this.tr('title_record_add', this.tr('mdl_role'))}</h1>
                <RoleForm {...this.props}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">Add New Role</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>Cancel</button>
                    </div>
                </RoleForm>
            </div>
        )
    }
}

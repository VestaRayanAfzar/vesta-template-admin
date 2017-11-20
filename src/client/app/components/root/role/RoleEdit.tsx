import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState, Save} from "../../PageComponent";
import {RoleForm} from "./RoleForm";
import {IRole} from "../../../cmn/models/Role";
import {IExtPermission} from "../Role";
import {IValidationError} from "../../../cmn/core/Validator";

export interface RoleEditParams {
    id: number;
}

export interface RoleEditProps extends PageComponentProps<RoleEditParams> {
    fetch: FetchById<IRole>;
    save: Save<IRole>;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export interface RoleEditState extends PageComponentState {
}

export class RoleEdit extends PageComponent<RoleEditProps, RoleEditState> {

    public render() {
        return (
            <div className="crud-page">
                <h1>{this.tr('title_record_edit', this.tr('mdl_role'))}</h1>
                <RoleForm {...this.props}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">Save Role</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>Cancel</button>
                    </div>
                </RoleForm>
            </div>
        )
    }
}

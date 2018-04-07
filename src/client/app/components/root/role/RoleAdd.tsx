import React from "react";
import { IRole } from "../../../cmn/models/Role";
import { IValidationError } from "../../../medium";
import { IPageComponentProps, PageComponent, Save } from "../../PageComponent";
import { IExtPermission } from "../Role";
import { RoleForm } from "./RoleForm";

export interface IRoleAddParams {
}

export interface IRoleAddProps extends IPageComponentProps<IRoleAddParams> {
    permissions: IExtPermission;
    save: Save<IRole>;
    validationErrors: IValidationError;
}

export interface IRoleAddState {
}

export class RoleAdd extends PageComponent<IRoleAddProps, IRoleAddState> {

    public render() {
        return (
            <div className="crud-page">
                <h2>{this.tr("title_record_add", this.tr("role"))}</h2>
                <RoleForm {...this.props}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr("save")}</button>
                        <button className="btn btn-outline" type="button"
                            onClick={this.props.history.goBack}>{this.tr("cancel")}</button>
                    </div>
                </RoleForm>
            </div>
        );
    }
}

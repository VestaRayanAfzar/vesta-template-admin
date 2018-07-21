import React from "react";
import { IRole } from "../../../cmn/models/Role";
import { IValidationError } from "../../../medium";
import { FetchById, IPageComponentProps, PageComponent, Save } from "../../PageComponent";
import { IExtPermission } from "../Role";
import { RoleForm } from "./RoleForm";

interface IRoleEditParams {
    id: number;
}

interface IRoleEditProps extends IPageComponentProps<IRoleEditParams> {
    fetch: FetchById<IRole>;
    permissions: IExtPermission;
    save: Save<IRole>;
    validationErrors?: IValidationError;
}

interface IRoleEditState {
}

export class RoleEdit extends PageComponent<IRoleEditProps, IRoleEditState> {

    public render() {
        const { fetch, permissions, save, validationErrors } = this.props;
        const id = +this.props.match.params.id;

        return (
            <div className="crud-page">
                <h1>{this.tr("title_record_edit", this.tr("mdl_role"))}</h1>
                <RoleForm id={id} fetch={fetch} permissions={permissions} save={save}
                    validationErrors={validationErrors}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">Save Role</button>
                        <button className="btn btn-outline" type="button"
                            onClick={this.props.history.goBack}>Cancel</button>
                    </div>
                </RoleForm>
            </div>
        );
    }
}

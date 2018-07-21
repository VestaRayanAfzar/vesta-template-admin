import React from "react";
import { IRole } from "../../../cmn/models/Role";
import { IUser } from "../../../cmn/models/User";
import { IValidationError } from "../../../medium";
import { IPageComponentProps, PageComponent, Save } from "../../PageComponent";
import { UserForm } from "./UserForm";

interface IUserAddParams {
}

interface IUserAddProps extends IPageComponentProps<IUserAddParams> {
    roles: IRole[];
    save: Save<IUser>;
    validationErrors: IValidationError;
}

interface IUserAddState {
}

export class UserAdd extends PageComponent<IUserAddProps, IUserAddState> {

    public render() {
        const { save, validationErrors, roles } = this.props;

        return (
            <div className="crud-page">
                <h2>{this.tr("title_record_add", this.tr("mdl_user"))}</h2>
                <UserForm save={save} validationErrors={validationErrors} roles={roles}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr("add")}</button>
                        <button className="btn btn-outline" type="button"
                            onClick={this.props.history.goBack}>{this.tr("cancel")}</button>
                    </div>
                </UserForm>
            </div>
        );
    }
}

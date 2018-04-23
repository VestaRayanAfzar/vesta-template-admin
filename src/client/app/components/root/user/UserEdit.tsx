import React from "react";
import { IRole } from "../../../cmn/models/Role";
import { IUser } from "../../../cmn/models/User";
import { IValidationError } from "../../../medium";
import { FetchById, IPageComponentProps, PageComponent, Save } from "../../PageComponent";
import { UserForm } from "./UserForm";

interface IUserEditParams {
    id: number;
}

interface IUserEditProps extends IPageComponentProps<IUserEditParams> {
    fetch: FetchById<IUser>;
    roles: IRole[];
    save: Save<IUser>;
    validationErrors: IValidationError;
}

interface IUserEditState {
}

export class UserEdit extends PageComponent<IUserEditProps, IUserEditState> {

    public render() {
        const { save, fetch, validationErrors, roles } = this.props;
        const id = +this.props.match.params.id;

        return (
            <div className="crud-page">
                <h2>{this.tr("title_record_edit", this.tr("mdl_user"))}</h2>
                <UserForm id={id} fetch={fetch} save={save} validationErrors={validationErrors} roles={roles}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr("save")}</button>
                        <button className="btn btn-outline" type="button"
                            onClick={this.props.history.goBack}>{this.tr("cancel")}</button>
                    </div>
                </UserForm>
            </div>
        );
    }
}

import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState, Save} from "../../PageComponent";
import {UserForm} from "./UserForm";
import {IUser} from "../../../cmn/models/User";
import {IRole} from "../../../cmn/models/Role";
import {IValidationError} from "../../../cmn/core/Validator";

export interface UserEditParams {
    id: number;
}

export interface UserEditProps extends PageComponentProps<UserEditParams> {
    fetch: FetchById<IUser>;
    save: Save<IUser>;
    validationErrors: IValidationError;
    roles: Array<IRole>;
}

export interface UserEditState extends PageComponentState {
}

export class UserEdit extends PageComponent<UserEditProps, UserEditState> {

    public render() {
        let {save, fetch, validationErrors, roles} = this.props;
        const id = +this.props.match.params.id;
        return (
            <div className="crud-page">
                <h1>{this.tr('title_record_edit', this.tr('mdl_user'))}</h1>
                <UserForm id={id} fetch={fetch} save={save} validationErrors={validationErrors} roles={roles}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr('save')}</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>{this.tr('cancel')}</button>
                    </div>
                </UserForm>
            </div>
        )
    }
}

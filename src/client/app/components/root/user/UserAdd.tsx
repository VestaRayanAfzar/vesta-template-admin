import React from "react";
import {PageComponent, PageComponentProps, PageComponentState, Save} from "../../PageComponent";
import {UserForm} from "./UserForm";
import {IUser} from "../../../cmn/models/User";
import {IRole} from "../../../cmn/models/Role";
import {IValidationError} from "../../../cmn/core/Validator";

export interface UserAddParams {
}

export interface UserAddProps extends PageComponentProps<UserAddParams> {
    save: Save<IUser>;
    validationErrors: IValidationError;
    roles: Array<IRole>;
}

export interface UserAddState extends PageComponentState {
}

export class UserAdd extends PageComponent<UserAddProps, UserAddState> {

    public render() {
        let {save, validationErrors, roles} = this.props;
        return (
            <div className="crud-page">
                <h1>{this.tr('title_record_add', this.tr('mdl_user'))}</h1>
                <UserForm save={save} validationErrors={validationErrors} roles={roles}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr('add')}</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>{this.tr('cancel')}</button>
                    </div>
                </UserForm>
            </div>
        )
    }
}

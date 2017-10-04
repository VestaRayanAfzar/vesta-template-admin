import React from "react";
import {IValidationError} from "../../../medium";
import {PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {RoleForm} from "./RoleForm";
import {ChangeEventHandler, FormWrapper, SubmitEventHandler} from "../../general/form/FormWrapper";
import {IRole} from "../../../cmn/models/Role";
import {FormMultichoice} from "../../general/form/FormMultichoice";
import {IExtPermission} from "../Role";

export interface RoleAddParams {
}

export interface RoleAddProps extends PageComponentProps<RoleAddParams> {
    save: SubmitEventHandler;
    onChange: ChangeEventHandler;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export interface RoleAddState extends PageComponentState {
    role: IRole;
}

export class RoleAdd extends PageComponent<RoleAddProps, RoleAddState> {

    constructor(props: RoleAddProps) {
        super(props);
        this.state = {role: {}};
    }



    public onChange = (name: string, value: any) => {
        this.state.role[name] = value;
        this.setState({role: this.state.role});
    }

    public render() {
        const tr = this.tr.translate;
        return (
            <div className="page roleForm-component">
                <h1>{tr('title_record_add', tr('mdl_role'))}</h1>
                <div className="form-wrapper">
                    <FormWrapper name="roleAddForm" onSubmit={this.props.save} model={this.state.role}>
                        <RoleForm role={this.state.role} onChange={this.onChange} permissions={this.props.permissions}
                                  validationErrors={this.props.validationErrors}/>
                        <div className="btn-group">
                            <button className="btn btn-primary" type="submit">Add New Role</button>
                            <button className="btn" type="button" onClick={this.props.history.goBack}>Cancel</button>
                        </div>
                    </FormWrapper>
                </div>
            </div>);
    }
}

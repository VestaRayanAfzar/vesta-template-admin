import React from "react";
import {IValidationError} from "../../../medium";
import {FetchById, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {RoleForm} from "./RoleForm";
import {IRole} from "../../../cmn/models/Role";
import {FormWrapper, SubmitEventHandler} from "../../general/form/FormWrapper";
import {IExtPermission} from "../Role";

export interface RoleEditParams {
    id: number;
}

export interface RoleEditProps extends PageComponentProps<RoleEditParams> {
    fetch: FetchById<IRole>;
    save: SubmitEventHandler;
    validationErrors: IValidationError;
    permissions: IExtPermission;
}

export interface RoleEditState extends PageComponentState {
    role: IRole;
}

export class RoleEdit extends PageComponent<RoleEditProps, RoleEditState> {

    constructor(props: RoleEditProps) {
        super(props);
        this.state = {role: {}};
    }

    public componentDidMount() {
        this.props.fetch(+this.props.match.params.id)
            .then(role => this.setState({role}));
    }

    public onChange = (name: string, value: any) => {
        this.state.role[name] = value;
        this.setState({role: this.state.role});
    }

    public render() {
        let role = this.state.role || {};
        const tr = this.tr.translate;
        return (
            <div className="page roleForm-component">
                <h1>{tr('title_record_edit', tr('mdl_role'), role.id)}</h1>
                <div className="form-wrapper">
                    <FormWrapper name="roleEditForm" onSubmit={this.props.save} model={this.state.role}>
                        <RoleForm validationErrors={this.props.validationErrors} role={role}
                                  permissions={this.props.permissions} onChange={this.onChange}/>
                        <div className="btn-group">
                            <button className="btn btn-primary" type="submit">Save Role</button>
                            <button className="btn" type="button" onClick={this.props.history.goBack}>Cancel</button>
                        </div>
                    </FormWrapper>
                </div>
            </div>);
    }
}

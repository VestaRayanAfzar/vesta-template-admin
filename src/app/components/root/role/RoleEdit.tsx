import React from "react";
import { IPageComponentProps, PageComponent } from "../../PageComponent";
import { RoleForm } from "./RoleForm";

interface IRoleEditParams {
    id: number;
}

interface IRoleEditProps extends IPageComponentProps<IRoleEditParams> {
}

interface IRoleEditState {
}

export class RoleEdit extends PageComponent<IRoleEditProps, IRoleEditState> {

    public render() {
        const id = +this.props.match.params.id;

        return (
            <div className="crud-page">
                <h1>{this.tr("title_record_edit", this.tr("mdl_role"))}</h1>
                <RoleForm id={id} goBack={this.goBack}>
                    <div className="btn-group stick-btm">
                        <button className="btn btn-primary" type="submit">Save Role</button>
                        <button className="btn btn-secondary" type="button"
                            onClick={this.goBack}>Cancel</button>
                    </div>
                </RoleForm>
            </div>
        );
    }

    private goBack = () => {
        this.props.history.goBack();
    }
}

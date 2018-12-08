import React from "react";
import { IPageComponentProps, PageComponent } from "../../PageComponent";
import { RoleForm } from "./RoleForm";

interface IRoleAddParams {
}

interface IRoleAddProps extends IPageComponentProps<IRoleAddParams> {
}

interface IRoleAddState {
}

export class RoleAdd extends PageComponent<IRoleAddProps, IRoleAddState> {

    public render() {
        return (
            <div className="crud-page">
                <h2>{this.tr("title_record_add", this.tr("role"))}</h2>
                <RoleForm goBack={this.goBack}>
                    <div className="btn-group stick-btm">
                        <button className="btn btn-primary" type="submit">{this.tr("save")}</button>
                        <button className="btn btn-secondary" type="button"
                            onClick={this.goBack}>{this.tr("cancel")}</button>
                    </div>
                </RoleForm>
            </div>
        );
    }

    private goBack = () => {
        this.props.history.goBack();
    }
}

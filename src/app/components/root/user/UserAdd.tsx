import React from "react";
import { IPageComponentProps, PageComponent } from "../../PageComponent";
import { UserForm } from "./UserForm";

interface IUserAddParams {
}

interface IUserAddProps extends IPageComponentProps<IUserAddParams> {
}

interface IUserAddState {
}

export class UserAdd extends PageComponent<IUserAddProps, IUserAddState> {

    public render() {

        return (
            <div className="crud-page">
                <h2>{this.tr("title_record_add", this.tr("mdl_user"))}</h2>
                <UserForm goBack={this.goBack}>
                    <div className="btn-group stick-btm">
                        <button className="btn btn-primary" type="submit">{this.tr("add")}</button>
                        <button className="btn btn-secondary" type="button"
                            onClick={this.goBack}>{this.tr("cancel")}</button>
                    </div>
                </UserForm>
            </div>
        );
    }

    private goBack = () => {
        this.props.history.goBack();
    }
}

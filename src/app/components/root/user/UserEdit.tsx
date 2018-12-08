import React from "react";
import { IPageComponentProps, PageComponent } from "../../PageComponent";
import { UserForm } from "./UserForm";

interface IUserEditParams {
    id: number;
}

interface IUserEditProps extends IPageComponentProps<IUserEditParams> {
}

interface IUserEditState {
}

export class UserEdit extends PageComponent<IUserEditProps, IUserEditState> {

    public render() {
        const id = +this.props.match.params.id;

        return (
            <div className="crud-page">
                <h2>{this.tr("title_record_edit", this.tr("mdl_user"))}</h2>
                <UserForm id={id} goBack={this.goBack}>
                    <div className="btn-group stick-btm">
                        <button className="btn btn-primary" type="submit">{this.tr("save")}</button>
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

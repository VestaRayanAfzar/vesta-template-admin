import React from "react";
import { IContext } from "../../../cmn/models/Context";
import { IValidationError } from "../../../medium";
import { FetchById, IPageComponentProps, PageComponent, Save } from "../../PageComponent";
import { ContextForm } from "./ContextForm";

export interface IContextEditParams {
    id: number;
}

export interface IContextEditProps extends IPageComponentProps<IContextEditParams> {
    fetch: FetchById<IContext>;
    save: Save<IContext>;
    validationErrors: IValidationError;
}

export interface IContextEditState {
}

export class ContextEdit extends PageComponent<IContextEditProps, IContextEditState> {

    public render() {
        const { save, fetch, validationErrors } = this.props;
        const id = +this.props.match.params.id;

        return (
            <div className="crud-page">
                <h1>{this.tr("title_record_edit", this.tr("mdl_context"))}</h1>
                <ContextForm id={id} fetch={fetch} save={save} validationErrors={validationErrors}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr("save")}</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>{this.tr("cancel")}</button>
                    </div>
                </ContextForm>
            </div>
        );
    }
}

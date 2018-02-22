import React from "react";
import {IContext} from "../../../cmn/models/Context";
import { IValidationError } from "../../../medium";
import {IPageComponentProps, PageComponent, Save} from "../../PageComponent";
import {ContextForm} from "./ContextForm";

export interface IContextAddParams {
}

export interface IContextAddProps extends IPageComponentProps<IContextAddParams> {
    save: Save<IContext>;
    validationErrors: IValidationError;
}

export interface IContextAddState {
}

export class ContextAdd extends PageComponent<IContextAddProps, IContextAddState> {

    public render() {
        const {save, validationErrors} = this.props;

        return (
            <div className="crud-page">
                <h1>{this.tr("title_record_add", this.tr("mdl_context"))}</h1>
                <ContextForm save={save} validationErrors={validationErrors}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr("add")}</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>{this.tr("cancel")}</button>
                    </div>
                </ContextForm>
            </div>
        );
    }
}

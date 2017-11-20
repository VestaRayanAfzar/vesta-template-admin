import React from "react";
import {PageComponent, PageComponentProps, PageComponentState, Save} from "../../PageComponent";
import {ContextForm} from "./ContextForm";
import {IContext} from "../../../cmn/models/Context";
import {IValidationError} from "../../../cmn/core/Validator";

export interface ContextAddParams {
}

export interface ContextAddProps extends PageComponentProps<ContextAddParams> {
    save: Save<IContext>;
    validationErrors: IValidationError;
}

export interface ContextAddState extends PageComponentState {
}

export class ContextAdd extends PageComponent<ContextAddProps, ContextAddState> {

    public render() {
        let {save, validationErrors} = this.props;
        return (
            <div className="crud-page">
                <h1>{this.tr('title_record_add', this.tr('mdl_context'))}</h1>
                <ContextForm save={save} validationErrors={validationErrors}>
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr('add')}</button>
                        <button className="btn" type="button" onClick={this.props.history.goBack}>{this.tr('cancel')}</button>
                    </div>
                </ContextForm>
            </div>
        )
    }
}

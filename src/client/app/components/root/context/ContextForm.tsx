import React from "react";
import { IContext } from "../../../cmn/models/Context";
import { IValidationError } from "../../../medium";
import { IFieldValidationMessage, IModelValidationMessage, validationMessage } from "../../../util/Util";
import { FormTextArea } from "../../general/form/FormTextArea";
import { FormTextInput } from "../../general/form/FormTextInput";
import { FormWrapper } from "../../general/form/FormWrapper";
import { FetchById, IPageComponentProps, PageComponent, Save } from "../../PageComponent";

export interface IContextFormParams {
}

export interface IContextFormProps extends IPageComponentProps<IContextFormParams> {
    fetch?: FetchById<IContext>;
    id?: number;
    save: Save<IContext>;
    validationErrors: IValidationError;
}

export interface IContextFormState {
    context: IContext;
}

export class ContextForm extends PageComponent<IContextFormProps, IContextFormState> {

    constructor(props: IContextFormProps) {
        super(props);
        this.state = { context: {} };
    }

    public componentDidMount() {
        const id = +this.props.id;
        if (isNaN(id)) { return; }
        this.props.fetch(id)
            .then((context) => {
                this.setState({ context });
            });
    }

    public onChange = (name: string, value: any) => {
        this.state.context[name] = value;
        this.setState({ context: this.state.context });
    }

    public onSubmit = (e: Event) => {
        this.props.save(this.state.context);
    }

    public render() {
        const requiredErrorMessage = this.tr("err_required");
        const formErrorsMessages: IModelValidationMessage = {
            key: {
                maxLength: this.tr("err_max_length", 10),
                minLength: this.tr("err_min_length", 3),
                required: requiredErrorMessage,
            },
            value: {
                required: requiredErrorMessage,
            },
        };
        const { validationErrors } = this.props;
        const errors: IFieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

        const context = this.state.context;
        return (
            <FormWrapper name="contextForm" onSubmit={this.onSubmit}>
                <FormTextInput name="key" label={this.tr("fld_key")} value={context.key} placeholder={true}
                    error={errors.key} onChange={this.onChange} />
                <FormTextArea name="value" label={this.tr("fld_value")} value={context.value} placeholder={true}
                    error={errors.value} onChange={this.onChange} />
                {this.props.children}
            </FormWrapper>
        );
    }
}

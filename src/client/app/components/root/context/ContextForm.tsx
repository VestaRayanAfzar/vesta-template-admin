import React from "react";
import {FetchById, PageComponent, PageComponentProps, Save} from "../../PageComponent";
import {FieldValidationMessage, ModelValidationMessage, Util} from "../../../util/Util";
import {FormWrapper} from "../../general/form/FormWrapper";
import {IContext} from "../../../cmn/models/Context";
import {FormTextInput} from "../../general/form/FormTextInput";
import {FormTextArea} from "../../general/form/FormTextArea";
import {IValidationError} from "../../../cmn/core/Validator";

export interface ContextFormParams {
}

export interface ContextFormProps extends PageComponentProps<ContextFormParams> {
    id?: number;
    fetch?: FetchById<IContext>;
    save: Save<IContext>;
    validationErrors: IValidationError;
}

export interface ContextFormState {
    context: IContext;
}

export class ContextForm extends PageComponent<ContextFormProps, ContextFormState> {

    constructor(props: ContextFormProps) {
        super(props);
        this.state = {context: {}};
    }

    public componentDidMount() {
        const id = +this.props.id;
        if (isNaN(id)) return;
        this.props.fetch(id)
            .then(context => {

                this.setState({context});
            });
    }

    public onChange = (name: string, value: any) => {
        this.state.context[name] = value;
        this.setState({context: this.state.context});
    }

    public onSubmit = (e: Event) => {
        this.props.save(this.state.context);
    }

    public render() {
        const requiredErrorMessage = this.tr('err_required');
        const formErrorsMessages: ModelValidationMessage = {
            key: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 3),
                maxLength: this.tr('err_max_length', 10)
            },
            value: {
                required: requiredErrorMessage
            }
        };
        const {validationErrors} = this.props;
        const errors: FieldValidationMessage = validationErrors ? Util.validationMessage(formErrorsMessages, validationErrors) : {};

        let context = this.state.context;
        return (
            <FormWrapper name="contextForm" onSubmit={this.onSubmit}>
                <FormTextInput name="key" label={this.tr('fld_key')} value={context.key} placeholder={true}
                               error={errors.key} onChange={this.onChange}/>
                <FormTextArea name="value" label={this.tr('fld_value')} value={context.value} placeholder={true}
                              error={errors.value} onChange={this.onChange}/>
                {this.props.children}
            </FormWrapper>
        )
    }
}

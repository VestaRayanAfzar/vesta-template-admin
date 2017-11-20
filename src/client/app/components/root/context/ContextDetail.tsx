import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IContext} from "../../../cmn/models/Context";

export interface ContextDetailParams {
    id: number;
}

export interface ContextDetailProps extends PageComponentProps<ContextDetailParams> {
    fetch: FetchById<IContext>;
}

export interface ContextDetailState extends PageComponentState {
    context: IContext;
}

export class ContextDetail extends PageComponent<ContextDetailProps, ContextDetailState> {

    constructor(props: ContextDetailProps) {
        super(props);
        this.state = {context: {}};
    }

    public componentDidMount() {
        this.props.fetch(+this.props.match.params.id)
            .then(context => this.setState({context}));
    }

    public render() {
        const context = this.state.context;
        if (!context) return null;
        return (
            <div className="crud-page">
                <table className="details-table">
                    <thead>
                    <tr>
                        <th colSpan={2}>{this.tr('title_record_detail', this.tr('mdl_context'), context.id)}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
						<td>{this.tr('fld_key')}</td>
						<td>{context.key}</td>
					</tr>
					<tr>
						<td>{this.tr('fld_value')}</td>
						<td>{context.value}</td>
					</tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

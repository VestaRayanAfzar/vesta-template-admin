import React from "react";
import { IContext } from "../../../cmn/models/Context";
import { FetchById, IPageComponentProps, PageComponent } from "../../PageComponent";

interface IContextDetailParams {
    id: number;
}

interface IContextDetailProps extends IPageComponentProps<IContextDetailParams> {
    fetch: FetchById<IContext>;
}

interface IContextDetailState {
    context: IContext;
}

export class ContextDetail extends PageComponent<IContextDetailProps, IContextDetailState> {

    constructor(props: IContextDetailProps) {
        super(props);
        this.state = { context: {} };
    }

    public componentDidMount() {
        this.props.fetch(+this.props.match.params.id)
            .then((context) => this.setState({ context }));
    }

    public render() {
        const { context } = this.state;
        if (!context) { return null; }

        return (
            <div className="crud-page">
                <table className="details-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>{this.tr("title_record_detail", this.tr("mdl_context"), context.id)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.tr("fld_key")}</td>
                            <td>{context.key}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_value")}</td>
                            <td>{context.value}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

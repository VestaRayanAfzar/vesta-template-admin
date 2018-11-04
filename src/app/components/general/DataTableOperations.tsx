import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Translate } from "../../medium";
import { IAccess } from "../../service/AuthService";
import { IBaseComponentProps } from "../BaseComponent";
import { Icon } from "./Icon";
import { MessageBox, MessageBoxBtn, MessageBoxBtnGroup } from "./MessageBox";

export interface IDataTableOperationsProps extends IBaseComponentProps {
    path: string;
    id: number;
    access: IAccess;
    onDelete: (id: number) => void;
}

export interface IDataTableOperationsState {
    showConfirmBox: boolean;
}

export class DataTableOperations extends PureComponent<IDataTableOperationsProps, IDataTableOperationsState> {
    private tr = Translate.getInstance().translate;

    constructor(props: IDataTableOperationsProps) {
        super(props);
        this.state = { showConfirmBox: false };
    }

    public render() {
        const { path, access, id } = this.props;
        const { showConfirmBox } = this.state;
        const editLink = access.edit ?
            <Link to={`/${path}/edit/${id}`} className="edit-btn"><Icon name="mode_edit" /></Link> : null;
        const delLink = access.del ?
            <span className="del-btn" onClick={this.onDelete}><Icon name="delete" /></span> : null;

        return (
            <span className="data-table-operations dt-operation-cell">
                <Link to={`/${path}/detail/${id}`}><Icon name="search" /></Link>
                {editLink}
                {delLink}
                <MessageBox show={showConfirmBox} btnGroup={MessageBoxBtnGroup.YesNo} onAction={this.onAction}
                    title={this.tr("title_record_delete")}>
                    <p>{this.tr("msg_delete_confirm")}</p>
                </MessageBox>
            </span>
        );
    }

    private onDelete = (e) => {
        e.preventDefault();
        this.setState({ showConfirmBox: true });
    }

    private onAction = (btn: MessageBoxBtn) => {
        this.setState({ showConfirmBox: false });
        if (btn == MessageBoxBtn.Yes) {
            this.props.onDelete(this.props.id);
        }
    }
}

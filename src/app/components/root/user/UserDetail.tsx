import React from "react";
import { IUser } from "../../../cmn/models/User";
import { ModelService } from "../../../service/ModelService";
import { getFileUrl } from "../../../util/Util";
import { IPageComponentProps, PageComponent } from "../../PageComponent";

interface IUserDetailParams {
    id: number;
}

interface IUserDetailProps extends IPageComponentProps<IUserDetailParams> {
}

interface IUserDetailState {
    user: IUser;
}

export class UserDetail extends PageComponent<IUserDetailProps, IUserDetailState> {
    private service = ModelService.getService<IUser>("user");
    private userTypeOptions = {
        1: this.tr("enum_admin"),
        2: this.tr("enum_user"),
    };
    constructor(props: IUserDetailProps) {
        super(props);
        this.state = { user: {} };
    }

    public componentDidMount() {
        this.service.fetch(+this.props.match.params.id)
            .then((user) => this.setState({ user }));
    }

    public render() {
        const user = this.state.user;
        if (!user) { return null; }
        const userGenderOptions = { 1: this.tr("enum_male"), 2: this.tr("enum_female") };
        const userImage = getFileUrl(`user/${user.image}`);
        const statusOptions = { 1: this.tr("enum_active"), 0: this.tr("enum_inactive") };
        return (
            <div className="crud-page">
                <table className="details-table">
                    <thead>
                        <tr>
                            <th colSpan={2}>{this.tr("title_record_detail", this.tr("mdl_user"), user.id)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.tr("fld_type")}</td>
                            <td>{user.type && user.type.map((i) => this.userTypeOptions[i]).join(" ")}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_username")}</td>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_name")}</td>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_email")}</td>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_mobile")}</td>
                            <td>{user.mobile}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_gender")}</td>
                            <td>{userGenderOptions[user.gender]}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_image")}</td>
                            <td>{<img src={userImage} />}</td>
                        </tr>
                        <tr>
                            <td>{this.tr("fld_status")}</td>
                            <td>{statusOptions[user.status]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

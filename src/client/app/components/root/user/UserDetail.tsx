import React from "react";
import {FetchById, PageComponent, PageComponentProps, PageComponentState} from "../../PageComponent";
import {IUser} from "../../../cmn/models/User";
import {IRole} from "../../../cmn/models/Role";
import {Util} from "../../../util/Util";

export interface UserDetailParams {
    id: number;
}

export interface UserDetailProps extends PageComponentProps<UserDetailParams> {
    fetch: FetchById<IUser>;
    roles: Array<IRole>;
}

export interface UserDetailState extends PageComponentState {
    user: IUser;
}

export class UserDetail extends PageComponent<UserDetailProps, UserDetailState> {

    constructor(props: UserDetailProps) {
        super(props);
        this.state = {user: null};
    }

    public componentDidMount() {
        this.props.fetch(+this.props.match.params.id)
            .then(user => this.setState({user}));
    }

    public render() {
        const user = this.state.user;
        if (!user) return null;
        const userTypeOptions = {
            2: this.tr('enum_staff'),
            3: this.tr('enum_mechanic'),
            4: this.tr('enum_technician'),
            5: this.tr('enum_user')
        };
        const userGenderOptions = {1: this.tr('enum_male'), 2: this.tr('enum_female')};
        const userImage = Util.getFileUrl(`user/${user.image}`);
        const statusOptions = {1: this.tr('enum_active'), 0: this.tr('enum_inactive')};
        return (
            <div className="crud-page">
                <table className="details-table">
                    <thead>
                    <tr>
                        <th colSpan={2}>{this.tr('title_record_detail', this.tr('mdl_user'), user.id)}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{this.tr('fld_type')}</td>
                        <td>{user.type && user.type.map((i) => userTypeOptions[i]).join(' ')}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_username')}</td>
                        <td>{user.username}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_name')}</td>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_email')}</td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_mobile')}</td>
                        <td>{user.mobile}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_gender')}</td>
                        <td>{userGenderOptions[user.gender]}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_image')}</td>
                        <td>{<img src={userImage}/>}</td>
                    </tr>
                    <tr>
                        <td>{this.tr('fld_status')}</td>
                        <td>{statusOptions[user.status]}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

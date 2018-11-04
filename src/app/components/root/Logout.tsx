import { IUser } from "../../cmn/models/User";
import { LogService } from "../../service/LogService";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface ILogoutParams {
}

interface ILogoutProps extends IPageComponentProps<ILogoutParams> {
}

interface ILogoutState {
}

export class Logout extends PageComponent<ILogoutProps, ILogoutState> {

    public constructor(props: ILogoutProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        if (this.auth.isGuest()) {
            return this.props.history.replace("/");
        }
        Preloader.show();
        this.api.get<IUser>("account/logout")
            .then((response) => {
                this.onAfterLogout(response.items[0]);
            })
            .catch((error) => {
                LogService.error(error, "componentDidMount", "Logout");
                this.onAfterLogout({});
            });
    }

    public componentWillUnmount() {
        Preloader.hide();
    }

    public render() {
        return null;
    }

    private onAfterLogout(user: IUser) {
        this.auth.logout();
        this.auth.login(user);
        this.props.history.replace("/");
    }
}

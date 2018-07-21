export class NetworkService {

    public static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    private static instance: NetworkService;

    constructor() {
        NetworkService.instance = this;
    }

    public isOnline(): boolean {
        return navigator.onLine;
    }
}

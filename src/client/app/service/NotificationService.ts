export class NotificationService {

    static instance: NotificationService;

    constructor() {
    }


    public static getInstance(): NotificationService {
        return NotificationService.instance;
    }
}
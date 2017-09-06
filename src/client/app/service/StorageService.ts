export class StorageService {
    private storage: Storage = localStorage;
    private static instance: StorageService;

    public set<T>(key: string, value: T) {
        try {
            this.storage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // QUOTA_EXCEEDED_ERR
            // localStorage is full
        }
        StorageService.instance = this;
    }

    public get<T>(key: string): T {
        let value: any = this.storage.getItem(key),
            object: T;
        try {
            object = JSON.parse(value);
        } catch (e) {
            object = <T>value;
        }
        return object;
    }

    public remove(key: string): boolean {
        this.storage.removeItem(key);
        return true;
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }
}

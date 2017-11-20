export enum StorageType {Local = 1, Session}

export class StorageService {
    private static storage: Storage = localStorage;

    public static set<T>(key: string, value: T) {
        try {
            StorageService.storage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // QUOTA_EXCEEDED_ERR
            // localStorage is full
        }
    }

    public static get<T>(key: string): T {
        let value: any = StorageService.storage.getItem(key),
            object: T;
        try {
            object = JSON.parse(value);
        } catch (e) {
            object = <T>value;
        }
        return object;
    }

    public static remove(key: string): boolean {
        StorageService.storage.removeItem(key);
        return true;
    }

    public static setStorage(type: StorageType) {
        StorageService.storage = type == StorageType.Session ? sessionStorage : localStorage;
    }
}

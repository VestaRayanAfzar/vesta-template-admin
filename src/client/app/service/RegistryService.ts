export class RegistryService {
    private static storage: any = {};

    private constructor() {
    }

    public static set<T>(key: string, value: T) {
        RegistryService.storage[key] = value;
        return value;
    }

    public static get<T>(key: string, defaultValue: T) {
        if (key in RegistryService.storage) {
            return RegistryService.storage[key];
        }
        return defaultValue || null;
    }

}
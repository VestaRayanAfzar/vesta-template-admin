import { IDataTableQueryOption } from "../components/general/DataTable";
import { Preloader } from "../components/general/Preloader";
import { Err, IDeleteResult, Model, Translate, ValidationError } from "../medium";
import { ApiService } from "./ApiService";
import { NotificationService } from "./NotificationService";

export class ModelService<T> {

    public static getService<T>(modelName, edge?: string): ModelService<T> {
        if (!(modelName in ModelService.instances)) {
            ModelService.instances[modelName] = new this(edge || modelName);
        }
        return ModelService.instances[modelName];
    }

    private static instances: { [name: string]: ModelService<any> } = {};
    protected tr = Translate.getInstance().translate;
    protected api = ApiService.getInstance();
    protected notif = NotificationService.getInstance();

    protected constructor(protected edge: string) { }

    public fetch(id: number): Promise<T> {
        return this.api.get<T>(`${this.edge}/${id}`)
            .then((result) => result.items[0])
            .catch((error) => {
                this.handleError(error);
                return null;
            });
    }

    public fetchAll(query: IDataTableQueryOption<T>): Promise<T[]> {
        return this.api.get<T>(this.edge, query)
            .then((response) => response.items)
            .catch((error) => {
                this.handleError(error);
                return [];
            });
    }

    public fetchCount(query: IDataTableQueryOption<T>): Promise<number> {
        return this.api.get<T>(`${this.edge}/count`, query)
            .then((response) => response.total)
            .catch((error) => {
                this.handleError(error);
                return 0;
            });
    }

    public insert(data: T, files?: T): Promise<T> {
        return this.api.post<T>(this.edge, data)
            .then((response) => {
                if (files) {
                    const id = (response.items[0] as any).id;
                    return this.api.upload<T>(`${this.edge}/file/${id}`, files);
                }
                return response;
            })
            .then((response) => {
                const id = (response.items[0] as any).id;
                this.notif.success(this.tr("info_add_record", id));
                return response.items[0];
            });
    }

    public remove(id: number): Promise<boolean> {
        return this.api.del<IDeleteResult>(`${this.edge}/${id}`)
            .then((response) => {
                this.notif.success(this.tr("info_delete_record", response.items[0]));
                return true;
            })
            .catch((error) => {
                this.handleError(error);
                return false;
            });
    }

    public save(model: T, files?: T): Promise<T> {
        return ((model as any).id ? this.update(model, files) : this.insert(model, files))
            .catch((error: Err) => {
                if (error.code === Err.Code.Validation) {
                    throw error;
                }
                return null;
            });
    }

    public submit(model: Model, ...fields: string[]) {
        const validationErrors = model.validate(...fields);
        if (validationErrors) {
            return Promise.reject(new ValidationError(validationErrors));
        }
        Preloader.show();
        return this.save(model.getValues(...fields))
            .then((result) => {
                Preloader.hide();
                return result;
            })
            .catch((error) => {
                Preloader.hide();
                throw error;
            });
    }

    public update(data: T, files?: T): Promise<T> {
        return this.api.put<T>(this.edge, data)
            .then((response) => {
                if (files) {
                    const id = (response.items[0] as any).id;
                    return this.api.upload<T>(`${this.edge}/file/${id}`, files);
                }
                return response;
            })
            .then((response) => {
                const id = (response.items[0] as any).id;
                this.notif.success(this.tr("info_update_record", id));
                return response.items[0];
            });
    }

    protected handleError(error: Err) {
        this.notif.error(error.message);
    }
}

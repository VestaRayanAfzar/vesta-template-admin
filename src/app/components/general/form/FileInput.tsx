import { Mime } from "@vesta/core";
import React, { PureComponent } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

interface IFileInputProps extends IBaseComponentProps, IFromControlProps {
    accept?: string;
    multiple?: boolean;
    value?: string | File | Array<string | File>;
}

interface IFileInputState {
    files: Array<string | File>;
    // this holds the base64 src of selected images | src of files already uploaded to server
    filesSrc: string[];
}

export class FileInput extends PureComponent<IFileInputProps, IFileInputState> {
    private hasStateChanged = false;

    constructor(props: IFileInputProps) {
        super(props);
        this.state = { files: [], filesSrc: [] };
        this.extractInitialValues(props);
    }

    public componentWillReceiveProps(nextProps: IFileInputProps) {
        if (this.hasStateChanged) { return; }
        this.extractInitialValues(nextProps);
    }

    public render() {
        const { name, label, error, multiple, placeholder, accept = "*/*" } = this.props;
        const thumbnails = this.renderThumbnails();

        return (
            <div className={`form-group file-input ${error ? "has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <div className="form-control">
                    {placeholder ? <label htmlFor={name}>{label}</label> : null}
                    <input name={name} type="file" onChange={this.onChange} multiple={multiple}
                        placeholder={placeholder ? label : ""} accept={accept} />
                    <p className="form-error">{error || ""}</p>
                    {thumbnails}
                </div>
            </div>
        );
    }

    private extractInitialValues(props: IFileInputProps) {
        const { multiple, value } = props;
        const { files, filesSrc } = this.state;
        if (value) {
            if (multiple) {
                for (let i = 0, il = (value as string[]).length; i < il; ++i) {
                    files.push(value[i]);
                    filesSrc.push(value[i]);
                }
            } else {
                files.push(value as string);
                filesSrc.push(value as string);
            }
        }
    }

    private getAppropriateFileWrapper(fileType: string, src: string) {
        switch (fileType) {
            case "image":
                return <img src={src} />;
            case "video":
                return <video controls={true}><source src={src} /></video>;
            default:
                return <span className="file" />;
        }
    }

    private onChange = (e) => {
        const { multiple } = this.props;
        this.hasStateChanged = true;
        if (multiple) {
            const files = [].concat(this.state.files);
            for (let i = 0, il = e.target.files.length; i < il; ++i) {
                files.push(e.target.files[i]);
            }
            return this.setState({ files }, this.onChangePropagate);
        }
        this.setState({ files: [e.target.files[0]], filesSrc: [] }, this.onChangePropagate);
    }

    private onChangePropagate = () => {
        const { name, onChange, multiple } = this.props;
        const { files } = this.state;
        onChange(name, multiple ? files : files[0]);
    }

    private readFile(file: File, index: number = 0) {
        const { filesSrc } = this.state;
        if (file.type.indexOf("image") === 0) {
            const reader = new FileReader();
            reader.addEventListener("load", (e: any) => {
                filesSrc[index] = e.target.result;
                this.setState({ filesSrc: [].concat(filesSrc) });
            });
            reader.readAsDataURL(file);
        } else {
            filesSrc[index] = `data:${file.type}`;
            // should be async
            setTimeout(() => this.setState({ filesSrc: [].concat(filesSrc) }), 10);
        }
    }

    private removeFile = (e) => {
        const { files, filesSrc } = this.state;
        const index = +e.currentTarget.getAttribute("data-index");
        this.hasStateChanged = true;
        files.splice(index, 1);
        filesSrc.splice(index, 1);
        this.setState({ files: [].concat(files), filesSrc: [].concat(filesSrc) }, this.onChangePropagate);
    }

    private renderThumbnails() {
        const { files, filesSrc } = this.state;
        const thumbnails = [];
        for (let i = 0, il = files.length; i < il; ++i) {
            // new file has been selected
            if (files[i] instanceof File && !filesSrc[i]) {
                const file: File = files[i] as File;
                if (file.type.indexOf("image/") === 0) {
                    this.readFile(files[i] as File, i);
                    // this process should continue after read file is done
                    return null;
                } else {
                    filesSrc[i] = `data:${file.type}`;
                }
            }
            const src = filesSrc[i];
            let isImage = false;
            let fileType = "";
            // src = new file => data:type/extesion
            // else otherwise it's the url of uploaded file e.g. http://domain.com/path/to/file.ext
            if (src.indexOf("data:") == 0) {
                fileType = src.substring(5, src.indexOf("/"));
            } else {
                const extMatch = src.match(/\.([a-z0-9]+)$/i);
                if (extMatch) {
                    const mimeType = Mime.getMime(extMatch[1]);
                    if (mimeType.length) {
                        const mime = mimeType[0];
                        fileType = mime.substr(0, mime.indexOf("/"));
                    }
                }
            }
            isImage = fileType === "image";
            const wrapper = this.getAppropriateFileWrapper(fileType, src);
            thumbnails.push(
                <div className={`file-wrapper ${fileType}`} key={i}>
                    {wrapper}
                    <span className="file-del" data-index={i} onClick={this.removeFile}>X</span>
                </div>);
        }
        return (
            <div className="thumbnails">{thumbnails}</div>
        );
    }
}

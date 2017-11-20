import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface FormFileInputProps extends BaseComponentProps {
    label: string;
    name: string;
    value?: string | File | Array<string | File>;
    onChange?: ChangeEventHandler;
    error?: string;
    multiple?: boolean;
    placeholder?: boolean;
}

export class FormFileInput extends PureComponent<FormFileInputProps, null> {
    private wrapper: HTMLDivElement;

    public componentDidUpdate() {
        const files: string | File | Array<string | File> = this.props.value;
        if (!files) return;
        this.wrapper.innerHTML = '';
        if ('string' == typeof files) {
            return this.addImage(files);
        }
        if (files instanceof File) {
            return this.readFile(files);
        }
        if (Array.isArray(files)) {
            if ('string' == typeof files[0]) {
                for (let i = files.length; i--;) {
                    this.addImage(files[i] as string);
                }
            } else {
                for (let i = files.length; i--;) {
                    this.readFile(files[i] as File);
                }
            }
        }

    }

    private readFile(file: File) {
        let reader = new FileReader();
        reader.addEventListener('load', (e: any) => this.addImage(e.target.result));
        return reader.readAsDataURL(file);
    }

    private addImage(src) {
        let img = new Image();
        img.src = src;
        let imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-wrapper';
        imgWrapper.appendChild(img);
        let delBtn = document.createElement('span');
        delBtn.textContent = 'X';
        delBtn.className = 'img-del';
        imgWrapper.appendChild(delBtn);
        this.wrapper.appendChild(imgWrapper);
        delBtn.addEventListener('click', e => {

        }, false);
    }

    private onChange = (e) => {
        let {name, onChange, value, multiple} = this.props;
        if (multiple) {
            let files = value as Array<File> || [];
            for (let i = e.target.files.length; i--;) {
                files.push(e.target.files[i]);
            }
            return onChange(name, files);
        }
        onChange(name, e.target.files[0]);
    }

    public render() {
        let {name, label, error, multiple, placeholder} = this.props;
        return (
            <div className={`form-group file-input${error ? ' has-error' : ''}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <div className="form-control">
                    {placeholder ? <label htmlFor={name}>{label}</label> : null}
                    <input name={name} id={name} type="file" onChange={this.onChange} multiple={multiple}
                           placeholder={placeholder ? label : ''}/>
                    <p className="form-error">{error || ''}</p>
                    <div className="thumbnails" ref={wrapper => this.wrapper = wrapper}/>
                </div>
            </div>
        )
    }
}
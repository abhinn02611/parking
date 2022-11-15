import { Injectable } from '@angular/core';
@Injectable()
export class Session {
    constructor() { }

    set = (key: string, value: string) => {
        localStorage.setItem(key, value);
    }

    get = (key: string) => {
        let value = localStorage.getItem(key);
        if (!value) {
            value = '';
        }
        return value;
    }

    destroy = () => {
        localStorage.clear();
    }
}

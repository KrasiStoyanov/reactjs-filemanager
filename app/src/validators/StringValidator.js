import * as ValidationMessages from '../constants/ValidationMessages';

export let IsNullorEmpty = (string, stringLabel) => {
    if (string === null || string === undefined) {
        throw new Error(`${stringLabel} ${ValidationMessages.nullOrEmpty}`);
    }

    if (string.length <= 0) {
        throw new Error(`${stringLabel} cannot be empty`);
    }
};
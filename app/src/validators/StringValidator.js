import * as ValidationMessages from '../constants/ValidationMessages';

export let IsNullorEmpty = (string, stringLabel) => {
    if (string === null || string === undefined) {
        throw `${stringLabel} ${ValidationMessages.nullOrEmpty}`;
    }

    if (string.length <= 0) {
        throw `${stringLabel} cannot be empty`;
    }
};
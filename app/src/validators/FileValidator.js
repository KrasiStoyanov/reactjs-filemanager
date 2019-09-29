import * as ValidationMessages from '../constants/ValidationMessages';

export let HasExtension = (newFilename) => {
	if (!newFilename.includes('.')) {
		throw new Error(`File with name "${newFilename}" ${ValidationMessages.noExtension}`);
	}
}
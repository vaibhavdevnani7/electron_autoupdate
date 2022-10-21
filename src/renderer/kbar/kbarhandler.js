import {openurl} from './openurl';
import {createquery} from './querybuilder';

export function kbarhandler(event, enteredText) {
	if (event.code === "Enter") {
		if (enteredText != ''){
			console.log(createquery(enteredText))
			openurl(createquery(enteredText));
		}
	}
}
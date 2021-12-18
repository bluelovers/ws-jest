import { matcherHint, printReceived } from 'jest-matcher-utils';

export function passMessage(received: any, matcherName: string, type: string)
{
	return () =>
		matcherHint(`.not.${matcherName}`, 'received', '') +
		'\n\n' +
		`Expected value to not be a ${type} received:\n` +
		`  ${printReceived(received)}`;
}

export function failMessage(received: any, matcherName: string, type: string)
{
	return () =>
		matcherHint(`.${matcherName}`, 'received', '') +
		'\n\n' +
		`Expected value to be a ${type} received:\n` +
		`  ${printReceived(received)}`;
}

export function autoMessage(pass: boolean, received: any, matcherName: string, type: string)
{
	return pass ? passMessage(received, matcherName, type) : failMessage(received, matcherName, type)
}

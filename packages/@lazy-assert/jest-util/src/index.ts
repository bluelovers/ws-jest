import { matcherHint, MatcherHintOptions, printReceived } from 'jest-matcher-utils';
import { IMatcherContext } from '@lazy-assert/jest-global-types-extra';

export function handleJestMatcherHintOptions(context: IMatcherContext, options?: MatcherHintOptions)
{
	options ??= {};
	options.isNot = context.isNot;
	options.promise = context.promise;
	options.secondArgumentColor ??= (arg: string) => arg;

	return options
}

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

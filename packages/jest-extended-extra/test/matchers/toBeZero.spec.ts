import { toBeZero } from '../../lib/matchers/toBeZero';

expect.extend({
	toBeZero,
})

test(`0`, () =>
{
	expect(0).toBeZero();
});

test(`-0`, () =>
{
	expect(-0).toBeZero();
});

test(`throw`, () =>
{
	expect(() => expect(-0).not.toBeZero()).toThrowErrorMatchingSnapshot();

});

test(`''`, () =>
{
	expect('').not.toBeZero();
});

test(`'0'`, () =>
{
	expect('0').not.toBeZero();
});

test(`'-0'`, () =>
{
	expect('-0').not.toBeZero();
});

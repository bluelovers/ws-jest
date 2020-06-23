import matcher from '../';

expect.extend(matcher);

describe(`.toBeCloseWith`, () =>
{

	test('passes when given number', () => {
		expect(0.95).toBeCloseWith(1, 0.05)
	});

	test('fails when given number out range', () => {
		expect(() => expect(0.9499999).toBeCloseWith(1, 0.05)).toThrowErrorMatchingSnapshot();
	});

	test('fails when given non-number', () => {
		expect(() => expect('').toBeCloseWith(1)).toThrowErrorMatchingSnapshot();
	});

})

describe(`not.toBeCloseWith`, () =>
{

	test('passes when given number', () => {
		expect(0.9499999).not.toBeCloseWith(1, 0.05);
	});

	test('fails when given number in range', () => {
		expect(() => expect(0.95).not.toBeCloseWith(1, 0.05)).toThrowErrorMatchingSnapshot();
	});

	test('fails when given non-number', () => {
		expect(() => expect('').not.toBeCloseWith(1)).toThrowErrorMatchingSnapshot();
	});

})

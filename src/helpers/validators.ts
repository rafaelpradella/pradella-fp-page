import * as E from 'fp-ts/Either';
import { map } from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getSemigroup } from 'fp-ts/lib/ReadonlyNonEmptyArray';

import { Tester } from './validators.codec';
import { lift } from './functional';

Tester();

export type ErrorsList = Array<{ fieldId: string, message: string }>;
const MIN_LENGTH = 6;
const ERROR_MSG = {
	NO_CONTENT: 'Fill the field',
	LENGTH: 'At least 6 characters',
	CAPITAL_LETTER: 'Include 1 capital letter',
	NUMBER: 'At least 1 number',
} as const;

const hasContent = (s: string) => pipe(s,
	E.fromPredicate(
		(s) => s?.replaceAll(/\s/g, '')?.length > 0,
		() => ERROR_MSG.NO_CONTENT
	)
);

const minLenght = (s: string) => pipe(s,
	E.fromPredicate(
		(s) => s?.length > MIN_LENGTH,
		() => ERROR_MSG.LENGTH
	)
);

const oneCapital = (s: string) => pipe(s,
	E.fromPredicate(
		(s) => /[A-Z]/g.test(s),
		() => ERROR_MSG.CAPITAL_LETTER
	)
);

const oneNumber = (s: string) => pipe(s,
	E.fromPredicate(
		(s) => /[0-9]/g.test(s),
		() => ERROR_MSG.NUMBER
	)
);

const formatToErrorObject = <E, A>(fieldId: string) => (errorList: E.Either<E, A>) =>
	pipe(errorList,
		E.mapLeft((errors) =>
			map(err => ({ fieldId, message: err }))
		)
	);

	export const validateName = (s: string) =>
		pipe(
			sequenceT(E.getApplicativeValidation(getSemigroup<string>()))(
				lift(hasContent)(s),
			),
			formatToErrorObject('Name'),
		)

	export const validatePassword = (s: string) =>
		pipe(
			sequenceT(E.getApplicativeValidation(getSemigroup<string>()))(
				lift(minLenght)(s),
				lift(oneCapital)(s),
				lift(oneNumber)(s),
			),
			formatToErrorObject('Password'),
		)


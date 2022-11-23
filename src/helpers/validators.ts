import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getSemigroup, ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray';

import { Tester } from './validators.codec';
import { lift, logPipe } from './functional';

Tester();

export type ErrorsList = Array<{ fieldId: string, message: string }>;
const MIN_LENGTH = 6;
const ERROR_MSG = {
	NO_CONTENT: 'Fill the field',
	LENGTH: 'At least 6 characters',
	CAPITAL_LETTER: 'Include 1 capital letter',
	NUMBER: 'At least 1 number',
} as const;

const hasContent = (s: string) =>
	(s?.replaceAll(/\s/g, '')?.length > 0) ? E.right(s) : E.left(ERROR_MSG.NO_CONTENT)

const minLenght = (s: string) =>
	(s?.length > MIN_LENGTH) ? E.right(s) : E.left(ERROR_MSG.LENGTH)

const oneCapital = (s: string) =>
	(/[A-Z]/g.test(s)) ? E.right(s) : E.left(ERROR_MSG.CAPITAL_LETTER)

const oneNumber = (s: string) =>
	(/[0-9]/g.test(s)) ? E.right(s) : E.left(ERROR_MSG.NUMBER)

const formatToErrorObject = <E, A>(fieldId: string) => (errorList: E.Either<E,A>) =>
	pipe(errorList,
		E.mapLeft((errors) =>
			A.map(err => ({ fieldId, message: err }))(errors)
		)
	);

export const validateName = (s: string) =>
	pipe(
		sequenceT(E.getApplicativeValidation(getSemigroup<string>()))(
			lift(hasContent)(s),
		),
		logPipe('sequenceT name'),
		formatToErrorObject('Name'),
		logPipe('formatted name'),
	)

export const validatePassword = (s: string) =>
	pipe(
		sequenceT(E.getApplicativeValidation(getSemigroup<string>()))(
			lift(minLenght)(s),
			lift(oneCapital)(s),
			lift(oneNumber)(s),
		),
		logPipe('sequenceT password'),
		formatToErrorObject('Password'),
		logPipe('formatted password'),
	)


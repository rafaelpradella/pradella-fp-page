import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { getSemigroup, ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray';

import { lift, LiftedEither } from '../helpers/functional';

type ValidationReturn = E.Either<string, string>

const MIN_LENGTH = 6;
const ERROR_MSG = {
    NO_CONTENT: 'Fill the field',
    LENGTH: 'At least 6 characters',
    CAPITAL_LETTER: 'Include 1 capital letter',
    NUMBER: 'At least 1 number',
} as const;

const hasContent = (s: string): ValidationReturn =>
    (s?.replaceAll(/\s/g, '')?.length > 0) ? E.right(s) : E.left(ERROR_MSG.NO_CONTENT)

const minLenght = (s: string): ValidationReturn =>
    (s?.length > MIN_LENGTH) ? E.right(s) : E.left(ERROR_MSG.LENGTH)

const oneCapital = (s: string): ValidationReturn =>
    (/[A-Z]/g.test(s)) ? E.right(s) : E.left(ERROR_MSG.CAPITAL_LETTER)

const oneNumber = (s: string): ValidationReturn =>
    (/[0-9]/g.test(s)) ? E.right(s) : E.left(ERROR_MSG.NUMBER)

export const validateName = (s: string): E.Either<ReadonlyNonEmptyArray<string>, Array<string>> =>
    pipe(
        sequenceT(E.getApplicativeValidation(getSemigroup<string>()))(
            lift(hasContent)(s),
        )
    )

export const validatePassword = (s: string): E.Either<ReadonlyNonEmptyArray<string>, Array<string>> =>
    pipe(
        sequenceT(E.getApplicativeValidation(getSemigroup<string>()))(
            lift(minLenght)(s),
            lift(oneCapital)(s),
            lift(oneNumber)(s),
        )
    )


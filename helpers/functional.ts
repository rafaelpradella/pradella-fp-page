import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export type LiftedEither<E, A> = E.Either<NonEmptyArray<E>, A>;

export function lift<E, A>(check: (a: A) => E.Either<E, A>): (a: A) => E.Either<NonEmptyArray<E>, A> {
return a =>
    pipe(
        check(a),
        E.mapLeft(a => [a])
    )
}
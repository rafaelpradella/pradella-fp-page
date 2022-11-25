import { getItem } from "fp-ts-local-storage";
import { pipe } from "fp-ts/lib/function";
import * as IO from 'fp-ts/IOOption'

const getSavedPlyrSettings = (setting: string) => pipe(
  getItem('plyr'),
  IO.map(JSON.parse),
  IO.map(obj => obj[setting]),
  IO.map(parseFloat),
);

export { getSavedPlyrSettings }
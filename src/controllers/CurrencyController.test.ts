//import { axe, toHaveNoViolations } from 'jest-axe';
import { test, expect } from '@jest/globals';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { makeUSDRatioFromOption, USDRatioFromOption } from '~/controllers/CurrencyController';
import CurrencyService from '~/services/currency';

const MOCK_QUERY = (currency: string) => ({ 
  query: { from: currency, to: USDRatioFromOption, amount: 1 },
  info: { timestamp: 123456, quote: 12 },
});

const MOCK_SERVICE = (currency: string, result: number, hasFailed = false) => 
  new Promise((resolve, reject) => 
    hasFailed 
      ? reject(TE.left(
        { ...MOCK_QUERY(currency), success: false }
      ))
      : resolve(TE.right(
        { ...MOCK_QUERY(currency), success: true, result }
      ))
  );

/*test('Get successful response of BRL > USD ratio', async() => {
  //const ratioRes = await makeUSDRatioFromOption({ fetcher: MOCK_SERVICE('BRL', 5.4) });
  const ratioRes = await makeUSDRatioFromOption({ fetcher: CurrencyService.fetchCurrencyToUSDRatio });
  console.warn('ratioRes', ratioRes);
  expect(E.isRight(ratioRes)).toBe(true);
})*/
import { rest } from 'msw';
import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import type { ComponentStory, ComponentMeta } from '@storybook/react'

import { USD_RATIO_MOCK, USD_RATIO_ERROR_MOCK } from '~/tests/mocks/usdRatio.mock';
import CurrencyConverter from '~/pages/currency-converter';

export default {
  title: 'Pages/CurrencyConverter',
  component: CurrencyConverter,
} as ComponentMeta<typeof CurrencyConverter>;

const Template: ComponentStory<typeof CurrencyConverter> = (args) => <CurrencyConverter {...args} />;

const checkDefaultUI = async (canvas: any) => { //Yeah, I know...
  await canvas.findByRole('heading', { level: 1, name: /currency/i });
  const allOptions = await canvas.findAllByRole('option', { selected: false });
  const feedbackBox = await canvas.findByRole('status');

  await canvas.findByRole('group', { name: /a-z/i });
  await canvas.findByRole('group', { name: /most exchanged/i });

  expect(feedbackBox).toHaveTextContent(/waiting/i);
  expect(allOptions.length).toBe(4);
}

// DEFAULT STATE
export const InitialSuccess = Template.bind({});
InitialSuccess.args = {
  error: null,
  topCurrencies: [['TOP', 'Top Currency #1'], ['TP2', 'Top Currency #2']],
  otherCurrencies: [['REG', 'Regular Currency #1'], ['ERR', 'Error Case']],
};
InitialSuccess.parameters = {
  msw: {
    handlers: [
      rest.get(/convert/i, (req, res, ctx) => {
        const reqCurrency = req.url.searchParams.get('to');

        if (!reqCurrency || reqCurrency === 'ERR') {
          //SIMULATE MALFORMED 'TO' PARAMETER
          return res(
            ctx.json(USD_RATIO_ERROR_MOCK)
          )
        }
        return res(ctx.json(USD_RATIO_MOCK(reqCurrency)))
      }),
    ],
  },
};
InitialSuccess.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  checkDefaultUI(canvas);
}

// DEFAULT ERROR
export const InitialError = Template.bind({});
InitialError.args = { error: 'Unable to test this test', topCurrencies: null, otherCurrencies: null };
InitialError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const errorGroup = await canvas.findByRole('group');

  await canvas.findByRole('heading', { level: 1, name: /currency/i });
  expect(errorGroup).toHaveTextContent(/something went wrong/i)
}

// DEFAULT WITH RATIO REQUEST
export const GetRatioResult = Template.bind({});
GetRatioResult.args = InitialSuccess.args;
GetRatioResult.parameters = InitialSuccess.parameters;
GetRatioResult.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  checkDefaultUI(canvas);
  const selectEl = await canvas.findByRole('combobox');
  const feedbackBox = await canvas.findByRole('status');

  await userEvent.selectOptions(selectEl, ['TOP']);
  expect(feedbackBox).toHaveTextContent(/please wait/i);
  
  waitFor(() => {
    expect(feedbackBox).toHaveTextContent(/remotesuccess/i);
    expect(feedbackBox).toHaveTextContent(/top ratio is: 9999/i);
  }, { timeout: 2000 })
}

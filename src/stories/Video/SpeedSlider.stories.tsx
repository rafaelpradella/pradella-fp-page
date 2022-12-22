import React from 'react';
import { expect } from '@storybook/jest';
import { within, userEvent, fireEvent } from '@storybook/testing-library';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { SpeedSlider } from '~/components/plyr/SpeedSlider';
import { APITypes } from 'plyr-react';

const MOCK_INSTANCE = { plyr: { speed: 1 } };
const plyrRef = React.createRef<Partial<APITypes>>();
plyrRef.current = MOCK_INSTANCE;

export default {
  title: 'Plyr/SpeedSlider',
  component: SpeedSlider,
} as ComponentMeta<typeof SpeedSlider>;

const Template: ComponentStory<typeof SpeedSlider> = (args) => <SpeedSlider {...args} />;

// DEFAULT STATE
export const Default = Template.bind({});
Default.args = {
  videoRef: plyrRef,
};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const sliderEl = await canvas.findByRole('slider');

  expect(sliderEl).toHaveAttribute('step', '0.25');
  await canvas.findByLabelText(/actual speed: 1x/i);

  fireEvent.change(sliderEl, { target: { value: 0.5 } })
  await canvas.findByLabelText(/0.5x/i);
  expect(plyrRef?.current?.plyr?.speed).toBe(0.5);

  fireEvent.change(sliderEl, { target: { value: 2 } })
  await canvas.findByLabelText(/2x/i);
  expect(plyrRef?.current?.plyr?.speed).toBe(2);
}

import React from 'react';
import { jest, expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { SpeedSlider } from '~/components/plyr/SpeedSlider';
import { APITypes } from 'plyr-react';

const MOCK_INSTANCE = { plyr: { speed: 1 }};
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
  const subtitle = await canvas.findByLabelText(/actual speed: 1x/i);
  expect(sliderEl).toHaveAttribute('step', '0.25');

  await userEvent.click(subtitle);
  await userEvent.keyboard('ArrowRight');
  
  canvas.findByLabelText(/1.25x/i);
  expect(plyrRef?.current?.plyr?.speed).toBe(1.25);
}

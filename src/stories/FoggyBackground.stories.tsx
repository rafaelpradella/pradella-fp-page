import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FoggyBackground } from '~/components/plyr/FoggyBackground';

export default {
  title: 'Plyr/FoggyBackground',
  component: FoggyBackground,
} as ComponentMeta<typeof FoggyBackground>;

const Template: ComponentStory<typeof FoggyBackground> = (args) => <FoggyBackground {...args} />;

export const ThreeColors = Template.bind({});
export const MultipleColors = Template.bind({});
export const OneColor = Template.bind({});
export const InvalidHex = Template.bind({});

ThreeColors.args = {
  colors: ['#24CB8E', '#72B9FA', '#D69DF8'],
};

MultipleColors.args = {
  colors: ['#FD96A0', '#E6A763', '#A0BF4A', '#24CB8E', '#72B9FA', '#D69DF8'],
}

OneColor.args = {
  colors: ['#24CB8E'],
};

InvalidHex.args = {
  colors: [42, '#a', 'rgb(255,255,255)']
};
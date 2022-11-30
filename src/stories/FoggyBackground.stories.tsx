import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FoggyBackground } from '~/components/plyr/FoggyBackground';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Plyr/FoggyBackground',
  component: FoggyBackground,
} as ComponentMeta<typeof FoggyBackground>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FoggyBackground> = (args) => <FoggyBackground {...args} />;

export const ThreeColors = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ThreeColors.args = {
  colors: ['#333', '#f00', '#00f'],
};

export const InvalidColors = Template.bind({});
InvalidColors.args = {
  colors: ['foggy', '#a', '#333333']
}

/*export const Secondary = Template.bind({});
Secondary.args = {
  label: 'FoggyBackground',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'FoggyBackground',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'FoggyBackground',
};*/

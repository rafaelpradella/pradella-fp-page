const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-css-modules",
  ],
  core: {
    builder: {
      name: "@storybook/builder-webpack5",
    },
  },
  features: {
    interactionsDebugger: true,
  },
  webpackFinal: async (config) => {
    //ADDING SASS MODULES SUPPORT
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader?modules&importLoaders', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });
    //RECOGNIZE TS ALIAS PATHS
    config.resolve.plugins = [new TsconfigPathsPlugin()];

    return config;
  },
};
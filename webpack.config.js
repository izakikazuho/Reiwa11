const mode = process.env.NODE_ENV || 'development'
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: mode,
  stats: {
    colors: true,
    preset: 'minimal',
  },
  entry: {
    main: './src/scripts/main.js',
    scss: './src/styles/style.scss',
  },
  output: {
    path: path.join(__dirname, '/dist/assets/js'),
    publicPath: '/assets/js/',
    filename: '[name].bundle.js',
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: '../css/style.css',
    }),

    new CopyPlugin({
      patterns: [
        {
          from: `**/*`,
          to: `../images`,
          context: `src/assets/images`,
          noErrorOnMissing: true
        },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['mozjpeg', { progressive: true }],
          ['pngquant', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },

          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: mode === 'development',
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: mode === 'development',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
    },
  },
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, '/dist'),
    watchContentBase: true,
    // inline: true,
    // hot: true,
    port: 3000,
  },
}

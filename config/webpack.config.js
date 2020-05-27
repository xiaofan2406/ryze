const path = require('path');
const ip = require('ip');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const paths = require('./paths');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDevelopment = env === 'development';
const isProductionProfile = isProduction && process.argv.includes('--profile');
const shouldUseSourceMap = process.env.USE_SOURCEMAP !== 'false';
const publicPath = '/';

module.exports = {
  mode: isProduction ? 'production' : isDevelopment && 'development',
  bail: isProduction,
  devtool: isProduction
    ? shouldUseSourceMap
      ? 'source-map'
      : false
    : isDevelopment && 'cheap-module-source-map',
  entry: `${paths.appSrc}/index.js`,
  output: {
    path: isProduction ? paths.appDist : undefined,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isDevelopment,
    filename: isProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isDevelopment && 'static/js/bundle.js',
    futureEmitAssets: true,
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : isDevelopment && 'static/js/[name].chunk.js',
    publicPath,
    devtoolModuleFilenameTemplate: isProduction
      ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
      : isDevelopment &&
        (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    globalObject: 'this',
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 8,
          compress: {
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          // Added for profiling in devtools
          keep_classnames: isProductionProfile,
          keep_fnames: isProductionProfile,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: shouldUseSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                // forces the source map to be output into a separate file
                inline: false,
                // appends the sourceMappingURL to the end of the css file,
                // helping the browser find the source map
                annotation: true,
              }
            : false,
        },
        cssProcessorPluginOptions: {
          preset: ['default', { minifyFontValues: { removeQuotes: false } }],
        },
      }),
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
  resolve: {
    alias: {
      // Allows for better profiling with ReactDevTools
      ...(isProductionProfile && {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      }),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },

          // Process application with Babel.
          {
            test: /\.(js|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: false,
              compact: isProduction,
            },
          },

          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use MiniCSSExtractPlugin to extract that CSS
          // to a file, but in development "style" loader enables hot editing
          // of CSS.
          {
            test: /\.css$/,
            use: [
              isDevelopment && require.resolve('style-loader'),
              isProduction && {
                loader: MiniCssExtractPlugin.loader,
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  sourceMap: isProduction && shouldUseSourceMap,
                },
              },
              {
                // Options for PostCSS as we reference these options twice
                // Adds vendor prefixing based on your specified browser support in
                // package.json
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('tailwindcss'),
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                      autoprefixer: { flexbox: 'no-2009' },
                      stage: 0,
                    }),
                  ],
                  sourceMap: isProduction && shouldUseSourceMap,
                },
              },
            ].filter(Boolean),

            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },

          // ** All ** new loaders must be added here, before file-loader!

          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: `${paths.appSrc}/assets/index.html`,
      favicon: `${paths.appSrc}/assets/favicon.ico`,
      minify: isProduction
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
        : false,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),

    isDevelopment && new webpack.HotModuleReplacementPlugin(),

    isDevelopment && new ReactRefreshWebpackPlugin(),

    isProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
  ].filter(Boolean),

  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false,

  devServer: {
    compress: true,
    clientLogLevel: 'none',
    contentBase: `${paths.appSrc}/assets`,
    contentBasePublicPath: publicPath,
    watchContentBase: true,
    hot: true,
    publicPath,
    stats: 'errors-only',
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    https: process.env.HTTPS === 'true',
    host: process.env.HOST || ip.address(),
    port: process.env.PORT || 8000,
  },
};

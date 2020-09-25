const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const fs = require('fs');

function generateHtmlPlugins(templateDir, outputDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${outputDir}/${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: true
    })
  })
}
htmlPages = generateHtmlPlugins('./src/pages', '.');


module.exports = {
  entry: {
      main: './src/index.js'
  },
  output: {
      filename: 'assets/js/[name].js',
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
      contentBase: './dist/'
  },
  optimization: {
    minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin({
      sourceMap: false,
      terserOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: false
    })]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            preprocessor: (content, loaderContext) =>
              content.replace(
                /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi,
                (m, src) => {
                  const filePath = path.resolve(loaderContext.context, src)
                  loaderContext.dependency(filePath)
                  return fs.readFileSync(filePath, 'utf8')
                }
              ),
              minimize: false
          }
        }
      },
      {
        test: /\.css$/,
        use: [
        {
           loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('autoprefixer')
              ]
            }
        }],
      },
      {
        test: /\.scss$/,
        use: [
        {
           loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [
                require('autoprefixer')
              ]
            }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]'
            },
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]'
            },
          },
        ]
      },
    ]
  },
  plugins: [ 
  // new webpack.ProvidePlugin({
  //     $: 'jquery',
  //     jQuery: 'jquery',
  //     'window.jQuery': 'jquery'
  //   }),
  new FileManagerPlugin({
        onStart: {
          delete: [
            './dist/assets/**/*'
          ]
        },
        onEnd: {
          // copy: [
          //   { source: './dist/assets', destination: './assets' }
          // ]
        }
      }),
  new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
  new MiniCssExtractPlugin({
        filename: 'assets/css/style.css',
      }),
  new PurgecssPlugin({
        paths: glob.sync(path.join(__dirname, 'src/**/*'),  { nodir: true }),
        whitelistPatterns: [/fancybox-.*/, /compensate-.*/],
      }),
  new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '90'
        },
        plugins: [
          imageminMozjpeg({
            quality: 90,
            progressive: true
          })
        ]
      })
  ].concat(htmlPages)
};
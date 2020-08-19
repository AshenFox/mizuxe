const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizaCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

// npm i -D

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizaCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: "./index.html", // throws an error if there is no
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/img/mlogo.png"),
          to: path.resolve(__dirname, "dist/img"),
        },
        {
          from: path.resolve(__dirname, "src/img/book.png"),
          to: path.resolve(__dirname, "dist/img"),
        },
        {
          from: path.resolve(__dirname, "src/img/person1.jpg"),
          to: path.resolve(__dirname, "dist/img"),
        },
        {
          from: path.resolve(__dirname, "src/img/person2.jpg"),
          to: path.resolve(__dirname, "dist/img"),
        },
        {
          from: path.resolve(__dirname, "src/img/person3.jpg"),
          to: path.resolve(__dirname, "dist/img"),
        },
        {
          from: path.resolve(__dirname, "src/img/person4.jpg"),
          to: path.resolve(__dirname, "dist/img"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ];

  // if (isProd) base.push(new BundleAnalyzerPlugin());

  return base;
};

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reload: true,
      },
    },
    "css-loader",
  ];

  if (extra) loaders.push(extra);

  return loaders;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      },
    },
  ];

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: "./index.js", // ,  "./index.tsx"
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".png"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 5000,
    hot: isDev,
    liveReload: true,
    watchContentBase: true,
  },
  devtool: isDev ? "source-map" : "",
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development", // Development mode unless specified otherwise
  entry: "./src/index.tsx", // Entry point of the application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.[contenthash].js", // Output bundle filename with hash for caching
    publicPath: "/", // Public URL of the output directory when referenced in a browser
    clean: true, // Clean the output directory before emit
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolve these extensions
    alias: {
      "@": path.resolve(__dirname, "src/"), // Alias for src directory (matches tsconfig)
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Add loaders for CSS, images, etc. here if needed later
      {
        test: /\.module\.css$/i, // Target .module.css files
        use: [
          "style-loader", // Injects styles into DOM
          {
            loader: "css-loader", // Translates CSS into CommonJS
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]", // Generate unique class names
              },
              importLoaders: 1,
            },
          },
        ],
      },
      // Optional: Add rule for global CSS files (not modules)
      // {
      //   test: /\.css$/i,
      //   exclude: /\.module\.css$/i, // Exclude module files
      //   use: ['style-loader', 'css-loader'],
      // },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: 'asset/resource',
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Template HTML file
      favicon: "./public/favicon.ico", // Optional: Add favicon path if you have one
      inject: "body", // Explicitly inject scripts at the end of the body
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // Serve static files from public
    },
    compress: true,
    port: 3000,
    historyApiFallback: true, // Redirect 404s to /index.html for SPA routing
    open: true, // Open browser automatically
    hot: true, // Enable Hot Module Replacement
  },
  // Use 'source-map' for development for better debugging
  // Use other options like 'cheap-module-source-map' for production if needed
  devtool: process.env.NODE_ENV === "production" ? undefined : "source-map",
};

import net, { AddressInfo } from "net";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import devServer from "webpack-dev-server";
import { merge } from "webpack-merge";

const getFreePort: (
  defaultPort?: number,
  defaultHost?: string
) => Promise<number> = (p, h) =>
  new Promise((resolve, reject) => {
    const server = net.createServer({
      pauseOnConnect: true,
    });

    const doListen: (port: number) => void = (p) => {
      server.listen(p, h ? h : "localhost");
    };

    server.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code.match("EADDRINUSE")) {
        server.close(() => doListen(0));
      } else {
        reject(err);
      }
    });

    server.addListener("listening", () => {
      const port = (<AddressInfo>server.address()).port;
      server.close(() => resolve(port));
    });

    doListen(p ? p : 0);
  });

const base = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "eslint-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: "file-loader",
      },
    ],
  },
};

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 8080;
const host = process.env.HOST ? process.env.HOST : "localhost";

getFreePort(port).then((p) => {
  const config: webpack.Configuration = merge(base, {
    mode: "development",
    target: "web",
    entry: [
      `webpack-dev-server/client?http://${host}:${p}`,
      path.join(__dirname, "src/index.ts"),
    ],
    output: {
      publicPath: "/",
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
    },
    devtool: "#@inline-source-map",
    module: {
      rules: [],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.html"),
      }),
    ],
    optimization: {
      namedModules: true,
    },
  });
  const compiler = webpack(config);
  const devConfig = Object.assign({}, config.devServer, {
    port: p,
    publicPath: `http://${host}:${p}`,
    open: true,
    contentBase: path.join(__dirname, "dist"),
    hot: true,
    historyApiFallback: true,
  });
  const server = new devServer(compiler, devConfig);
  server.listen(p, host, () =>
    console.log(`starting server on http://${host}:${p}`)
  );
});

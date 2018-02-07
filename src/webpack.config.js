const path = require("path")

let config = {
    entry: path.resolve(__dirname,"front/app.js"),
    output: {
        filename: "app.js",
        path: path.resolve(__dirname,"public")
    },
    module: {
        rules: [
            {   test: /\.css$/,
                loader: "css-loader"},
            {   test: /\.vue$/,
                loader: "vue-loader"},
            {   test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/},
            {   test: /\.(png|jpg|gif|svg|ttf|woff(2)?|eot)$/,
                loader: "file-loader"}
        ],
    },
    resolve: {
        extensions: [".js",".vue",".json"]
    },
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname,"public"),
        proxy: {
            "/api": "http://localhost:8080"
        },
        hot: false
    },
    plugins: []
}

module.exports = config
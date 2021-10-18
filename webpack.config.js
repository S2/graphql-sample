var webpack = require('webpack');
let time = new Date().getTime()

let entry = {
    "client" : [
        "./Run.ts" , 
    ] , 
}

let plugins = [
    new webpack.LoaderOptionsPlugin({
        options: {
        }
    })
];

module.exports = {
    mode: 'development', 
    cache:true , 
    entry: entry ,
    output: {
        filename: "[name].js?[hash:6]",
        path: "/Users/sato/guncys/guncys-sample/dist/"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader" ,
                options: {
                },
            },
        ]
    },
    plugins: plugins , 
};

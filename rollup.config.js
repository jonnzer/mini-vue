import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',   // input : 打包入口
    output: {
        file: 'dist/umd/vue.js', // 出口位置
        name: 'Vue',            // 打包后的全局变量名字
        format: 'umd',          // 统一模块规范
        sourcemap: true,        //  es6 => es5  开启源码调试 可以找到源码的报错位置
    },
    plugins: [
        babel({
            exclude: "node_modules/**" // 排除打包的位置
        }),
        process.env.ENV === 'development' ? serve({
            open: true,
            openPage: '/public/index.html', // 默认打开html的位置
            port: 3000,
            contentBase: ''
        }) : null
    ]
}
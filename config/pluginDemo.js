// function HelloWorldPlugin(options) {
//     // Setup the plugin instance with options...
// }
//
// HelloWorldPlugin.prototype.apply = function (compiler) {
//     compiler.hooks.run.tap('run', (compilation) => {
//         console.log('Hello World!');
//         compilation.hooks.compilation.tap('buildModule', function (res) {
//             // console.log('res:', res)
//         })
//     });
// };

class HelloWorldPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('compilation', (compiler) => {
            // console.log(compiler);
            // compilation.hooks.af.tap('succeedModule', function (res) {
            //     console.log(res.assets)
            // })
        })
    }
}

module.exports = HelloWorldPlugin;
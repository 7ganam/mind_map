const path = require('path');

module.exports = {
    entry: './src/webpack text_editor_text.mjs',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};
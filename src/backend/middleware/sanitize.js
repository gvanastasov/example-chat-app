const xss = require('xss');

const sanitize = (text) => xss(text);

module.exports = sanitize;
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-hex-prefixed";
exports.ids = ["vendor-chunks/is-hex-prefixed"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-hex-prefixed/src/index.js":
/*!***************************************************!*\
  !*** ./node_modules/is-hex-prefixed/src/index.js ***!
  \***************************************************/
/***/ ((module) => {

eval("/**\n * Returns a `Boolean` on whether or not the a `String` starts with '0x'\n * @param {String} str the string input value\n * @return {Boolean} a boolean if it is or is not hex prefixed\n * @throws if the str input is not a string\n */\nmodule.exports = function isHexPrefixed(str) {\n  if (typeof str !== 'string') {\n    throw new Error(\"[is-hex-prefixed] value must be type 'string', is currently type \" + (typeof str) + \", while checking isHexPrefixed.\");\n  }\n\n  return str.slice(0, 2) === '0x';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtaGV4LXByZWZpeGVkL3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Rpd2ktYXBwLy4vbm9kZV9tb2R1bGVzL2lzLWhleC1wcmVmaXhlZC9zcmMvaW5kZXguanM/NjA3ZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJldHVybnMgYSBgQm9vbGVhbmAgb24gd2hldGhlciBvciBub3QgdGhlIGEgYFN0cmluZ2Agc3RhcnRzIHdpdGggJzB4J1xuICogQHBhcmFtIHtTdHJpbmd9IHN0ciB0aGUgc3RyaW5nIGlucHV0IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufSBhIGJvb2xlYW4gaWYgaXQgaXMgb3IgaXMgbm90IGhleCBwcmVmaXhlZFxuICogQHRocm93cyBpZiB0aGUgc3RyIGlucHV0IGlzIG5vdCBhIHN0cmluZ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSGV4UHJlZml4ZWQoc3RyKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIltpcy1oZXgtcHJlZml4ZWRdIHZhbHVlIG11c3QgYmUgdHlwZSAnc3RyaW5nJywgaXMgY3VycmVudGx5IHR5cGUgXCIgKyAodHlwZW9mIHN0cikgKyBcIiwgd2hpbGUgY2hlY2tpbmcgaXNIZXhQcmVmaXhlZC5cIik7XG4gIH1cblxuICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-hex-prefixed/src/index.js\n");

/***/ })

};
;
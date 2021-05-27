var path = require('path');
var ref = require("ref-napi");
var ffi = require("ffi-napi");
var Struct = require("ref-struct-di")(ref)
var ArrayType = require("ref-array-di")(ref)
var LongArray = ArrayType(ref.types.longlong);
var GoSlice = Struct({
  data: LongArray,
  len:  "longlong",
  cap: "longlong"
});
var GoString = Struct({
  p: "string",
  n: "longlong"
});

var libFilename = process.platform == 'darwin' ? 'dmos.dylib' : 'dmos.so';
var dmosLib = ffi.Library(path.join(__dirname, '../src_go', libFilename), {
  Store: ["void", [GoString]],
  Boot: ["void", ["string"]],
  Shutdown: ["void", []],
  GetAll: ["string", []],
  Query: ["string", ["string"]],
  JsQuery: ["string", ["string"]],
});

var dmos = {};
dmos.store = dat => {
  var str = JSON.stringify(dat);
  var goStr = new GoString();
  goStr.p = str;
  goStr.n = str.length;
  return dmosLib.Store(goStr)
}
dmos.boot = (...a) => dmosLib.Boot(...a);
dmos.shutdown = () => dmosLib.Shutdown();
dmos.whereRaw = query => {
  return JSON.parse(dmosLib.Query(JSON.stringify(query)));
}
dmos.where = query => {
  qstr = query.toString().slice(5);
  return JSON.parse(dmosLib.JsQuery(qstr));
}
dmos.whereFnStr = qstr => {
  return JSON.parse(dmosLib.JsQuery(qstr));
}

module.exports = dmos;

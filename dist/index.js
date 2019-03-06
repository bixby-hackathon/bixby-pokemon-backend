'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pokemon = require('./api/pokemon');

var _pokemon2 = _interopRequireDefault(_pokemon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// logger
app.use((0, _morgan2.default)('dev'));

// 3rd party middleware
app.use((0, _cors2.default)({
  exposedHeaders: _config2.default.corsHeaders
}));

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _middleware2.default)({ config: _config2.default }));
app.use(_bodyParser2.default.json());

// api router
app.use('/pokemon', (0, _pokemon2.default)({ config: _config2.default }));

app.get('*', function (request, response) {
  response.sendFile(_path2.default.resolve(__dirname, './', 'signin.html'));
});

app.server.listen(process.env.PORT || _config2.default.port, function () {
  console.log('Started on port ' + app.server.address().port);
});

exports.default = app;
//# sourceMappingURL=index.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _pokedexPromiseV = require('pokedex-promise-v2');

var _pokedexPromiseV2 = _interopRequireDefault(_pokedexPromiseV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var P = new _pokedexPromiseV2.default();

exports.default = function (_ref) {
  var config = _ref.config;

  var api = (0, _express.Router)();

  api.get('/:name', function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
      var pokemon, formattedPokemon, speciesInfo;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return P.getPokemonByName(req.params.name);

            case 2:
              pokemon = _context.sent;
              formattedPokemon = {};
              _context.next = 6;
              return P.getPokemonSpeciesByName(req.params.name);

            case 6:
              speciesInfo = _context.sent;


              formattedPokemon.id = pokemon.id;
              formattedPokemon.sprite = pokemon.sprites.front_default;
              formattedPokemon.pokedexEntry = speciesInfo.flavor_text_entries.find(function (o) {
                return o.language.name === 'en';
              }).flavor_text;
              formattedPokemon.height = pokemon.height;
              formattedPokemon.weight = pokemon.weight;
              formattedPokemon.statHp = pokemon.stats.find(function (o) {
                return o.stat.name === 'attack';
              }).base_stat;
              formattedPokemon.statAttack = pokemon.stats.find(function (o) {
                return o.stat.name === 'attack';
              }).base_stat;
              formattedPokemon.statDefense = pokemon.stats.find(function (o) {
                return o.stat.name === 'defense';
              }).base_stat;
              formattedPokemon.statSpecialAttack = pokemon.stats.find(function (o) {
                return o.stat.name === 'special-attack';
              }).base_stat;
              formattedPokemon.statSpecialDefense = pokemon.stats.find(function (o) {
                return o.stat.name === 'special-defense';
              }).base_stat;
              formattedPokemon.statSpeed = pokemon.stats.find(function (o) {
                return o.stat.name === 'speed';
              }).base_stat;

              res.status(200).json(formattedPokemon);

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  return api;
};
//# sourceMappingURL=pokemon.js.map
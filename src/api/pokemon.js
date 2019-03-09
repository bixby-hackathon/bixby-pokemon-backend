import { Router } from 'express';
import Axios from 'axios';
import Pokedex from 'pokedex-promise-v2';
// import Sequelize from 'sequelize';
import { sequelize } from '../models';
// import { Pool, Client } from 'pg';
var config = require('../config/config.json');
const P = new Pokedex();

// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);

// if (process.env.DATABASE_URL) {
//   sequelize = new Sequelize(config.production);
// } else {
//   sequelize = new Sequelize(config.development);
// }

// const pool = new Pool({
//   username: 'postgres',
//   password: '',
//   database: 'bixbydex',
//   host: 'localhost',
//   dialect: 'postgres',
//   port: 5432,
// });

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
// });

// const client = new Client({
//   username: 'postgres',
//   password: '',
//   database: 'bixbydex',
//   host: 'localhost',
//   dialect: 'postgres',
//   port: 5432,
// });
// client.connect();

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
// });

const Search = require('../models').Search;

export default ({ config }) => {
  let api = Router();

  const replaceSpaces = string => {
    return string.replace(/ /g, '-');
  };

  const getSprites = sprites => {
    const spritesArray = [];
    if (sprites.front_default) {
      spritesArray.push({ url: sprites.front_default });
    }
    if (sprites.back_default) {
      spritesArray.push({ url: sprites.back_default });
    }
    if (sprites.front_shiny) {
      spritesArray.push({ url: sprites.front_shiny });
    }
    if (sprites.back_shiny) {
      spritesArray.push({ url: sprites.back_shiny });
    }
    return spritesArray;
  };

  const removeLinebreaks = string => {
    return string.replace(/\n/g, ' ');
  };

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getTypes = types => {
    const typesArray = [];
    types.forEach(type => {
      typesArray.push(type.type.name);
    });
    return typesArray;
  };

  api.get('/one/:name', async (req, res) => {
    try {
      let query = '';
      if (req.params.name === 'meowstic') {
        query = 'meowstic-male';
      } else {
        query = replaceSpaces(req.params.name);
      }
      let speciesInfo = {};
      const pokemon = await P.getPokemonByName(query);
      if (query === 'meowstic-male' || query === 'meowstic-female') {
        speciesInfo = await P.getPokemonSpeciesByName('meowstic');
      } else {
        speciesInfo = await P.getPokemonSpeciesByName(query);
      }
      const formattedPokemon = {};
      const abilities = pokemon.abilities;
      const ability1 = abilities.find(o => o.slot === 1);
      const ability2 = abilities.find(o => o.slot === 2);
      const ability3 = abilities.find(o => o.slot === 3);
      let ability1Resource = '';
      let ability2Resource = '';
      let ability3Resource = '';

      if (ability1) {
        ability1Resource = await P.resource(ability1.ability.url);
        formattedPokemon.ability1Description = removeLinebreaks(
          ability1Resource.effect_entries.find(o => o.language.name === 'en')
            .short_effect,
        );
        formattedPokemon.ability1 = ability1.ability.name;
      }
      if (ability2) {
        ability2Resource = await P.resource(ability2.ability.url);
        formattedPokemon.ability2Description = removeLinebreaks(
          ability2Resource.effect_entries.find(o => o.language.name === 'en')
            .short_effect,
        );
        formattedPokemon.ability2 = ability2.ability.name;
      }
      if (ability3) {
        ability3Resource = await P.resource(ability3.ability.url);
        formattedPokemon.ability3Description = removeLinebreaks(
          ability3Resource.effect_entries.find(o => o.language.name === 'en')
            .short_effect,
        );
        formattedPokemon.ability3 = ability3.ability.name;
      }

      formattedPokemon.id = pokemon.id;
      formattedPokemon.species = capitalizeFirstLetter(pokemon.name);
      if (query === 'meowstic-male' || query === 'meowstic-female') {
        formattedPokemon.species = 'Meowstic';
      }
      formattedPokemon.sprite = pokemon.sprites.front_default;
      formattedPokemon.sprites = getSprites(pokemon.sprites);
      if (pokemon.types.length > 1) {
        formattedPokemon.type1 = pokemon.types[1].type.name;
        formattedPokemon.type2 = pokemon.types[0].type.name;
      } else {
        formattedPokemon.type1 = pokemon.types[0].type.name;
      }
      formattedPokemon.pokedexEntry = removeLinebreaks(
        speciesInfo.flavor_text_entries.find(o => o.language.name === 'en')
          .flavor_text,
      );
      formattedPokemon.height = pokemon.height / 10;
      formattedPokemon.weight = pokemon.weight / 10;
      formattedPokemon.statHp = pokemon.stats.find(
        o => o.stat.name === 'attack',
      ).base_stat;
      formattedPokemon.statAttack = pokemon.stats.find(
        o => o.stat.name === 'attack',
      ).base_stat;
      formattedPokemon.statDefense = pokemon.stats.find(
        o => o.stat.name === 'defense',
      ).base_stat;
      formattedPokemon.statSpecialAttack = pokemon.stats.find(
        o => o.stat.name === 'special-attack',
      ).base_stat;
      formattedPokemon.statSpecialDefense = pokemon.stats.find(
        o => o.stat.name === 'special-defense',
      ).base_stat;
      formattedPokemon.statSpeed = pokemon.stats.find(
        o => o.stat.name === 'speed',
      ).base_stat;

      res.status(200).json(formattedPokemon);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  api.get('/more', async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    try {
      let query = '';
      if (req.params.name === 'meowstic') {
        query = 'meowstic-male';
      } else {
        query = replaceSpaces(req.params.name);
      }
      let speciesInfo = {};
      const pokemon = await P.getPokemonByName(query);
      if (query === 'meowstic-male' || query === 'meowstic-female') {
        speciesInfo = await P.getPokemonSpeciesByName('meowstic');
      } else {
        speciesInfo = await P.getPokemonSpeciesByName(query);
      }
      const formattedPokemon = {};
      const abilities = pokemon.abilities;
      const ability1 = abilities.find(o => o.slot === 1);
      const ability2 = abilities.find(o => o.slot === 2);
      const ability3 = abilities.find(o => o.slot === 3);
      let ability1Resource = '';
      let ability2Resource = '';
      let ability3Resource = '';

      if (ability1) {
        ability1Resource = await P.resource(ability1.ability.url);
        formattedPokemon.ability1Description = removeLinebreaks(
          ability1Resource.effect_entries.find(o => o.language.name === 'en')
            .short_effect,
        );
        formattedPokemon.ability1 = ability1.ability.name;
      }
      if (ability2) {
        ability2Resource = await P.resource(ability2.ability.url);
        formattedPokemon.ability2Description = removeLinebreaks(
          ability2Resource.effect_entries.find(o => o.language.name === 'en')
            .short_effect,
        );
        formattedPokemon.ability2 = ability2.ability.name;
      }
      if (ability3) {
        ability3Resource = await P.resource(ability3.ability.url);
        formattedPokemon.ability3Description = removeLinebreaks(
          ability3Resource.effect_entries.find(o => o.language.name === 'en')
            .short_effect,
        );
        formattedPokemon.ability3 = ability3.ability.name;
      }

      formattedPokemon.id = pokemon.id;
      formattedPokemon.species = capitalizeFirstLetter(pokemon.name);
      if (query === 'meowstic-male' || query === 'meowstic-female') {
        formattedPokemon.species = 'Meowstic';
      }
      formattedPokemon.sprite = pokemon.sprites.front_default;
      formattedPokemon.sprites = getSprites(pokemon.sprites);
      if (pokemon.types.length > 1) {
        formattedPokemon.type1 = pokemon.types[1].type.name;
        formattedPokemon.type2 = pokemon.types[0].type.name;
      } else {
        formattedPokemon.type1 = pokemon.types[0].type.name;
      }
      formattedPokemon.pokedexEntry = removeLinebreaks(
        speciesInfo.flavor_text_entries.find(o => o.language.name === 'en')
          .flavor_text,
      );
      formattedPokemon.height = pokemon.height / 10;
      formattedPokemon.weight = pokemon.weight / 10;
      formattedPokemon.statHp = pokemon.stats.find(
        o => o.stat.name === 'attack',
      ).base_stat;
      formattedPokemon.statAttack = pokemon.stats.find(
        o => o.stat.name === 'attack',
      ).base_stat;
      formattedPokemon.statDefense = pokemon.stats.find(
        o => o.stat.name === 'defense',
      ).base_stat;
      formattedPokemon.statSpecialAttack = pokemon.stats.find(
        o => o.stat.name === 'special-attack',
      ).base_stat;
      formattedPokemon.statSpecialDefense = pokemon.stats.find(
        o => o.stat.name === 'special-defense',
      ).base_stat;
      formattedPokemon.statSpeed = pokemon.stats.find(
        o => o.stat.name === 'speed',
      ).base_stat;

      res.status(200).json(formattedPokemon);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  api.get('/popular', async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);

    try {
      const psqlQuery =
        'SELECT name, COUNT(*) FROM "Searches" GROUP BY name ORDER BY count DESC';
      // const results = await client.query(psqlQuery);
      const results = await sequelize.query(psqlQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
      console.log(results);
      // const searches = await Search.findAll();
      res.status(200).json(results);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  return api;
};

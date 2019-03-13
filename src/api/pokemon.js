import { Router } from 'express';
import Pokedex from 'pokedex-promise-v2';
import { sequelize } from '../models';
const P = new Pokedex();

const Search = require('../models').Search;
const Pokemon = require('../models').Pokemon;
const EvolutionChain = require('../models').EvolutionChain;

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

  const setQuery = name => {
    let query = '';
    if (name === 'meowstic') {
      query = 'meowstic-male';
    } else {
      query = replaceSpaces(name);
    }
    return query;
  };

  // const getPokemon = async name => {
  //   try {
  //     let query = setQuery(name);
  //     let speciesInfo = {};
  //     const pokemon = await P.getPokemonByName(query);
  //     if (query === 'meowstic-male' || query === 'meowstic-female') {
  //       speciesInfo = await P.getPokemonSpeciesByName('meowstic');
  //     } else {
  //       speciesInfo = await P.getPokemonSpeciesByName(query);
  //     }
  //     const formattedPokemon = {};
  //     const abilities = pokemon.abilities;
  //     const ability1 = abilities.find(o => o.slot === 1);
  //     const ability2 = abilities.find(o => o.slot === 2);
  //     const ability3 = abilities.find(o => o.slot === 3);
  //     let ability1Resource = '';
  //     let ability2Resource = '';
  //     let ability3Resource = '';

  //     if (ability1) {
  //       ability1Resource = await P.resource(ability1.ability.url);
  //       formattedPokemon.ability1Description = removeLinebreaks(
  //         ability1Resource.effect_entries.find(o => o.language.name === 'en')
  //           .short_effect,
  //       );
  //       formattedPokemon.ability1 = ability1.ability.name;
  //     }
  //     if (ability2) {
  //       ability2Resource = await P.resource(ability2.ability.url);
  //       formattedPokemon.ability2Description = removeLinebreaks(
  //         ability2Resource.effect_entries.find(o => o.language.name === 'en')
  //           .short_effect,
  //       );
  //       formattedPokemon.ability2 = ability2.ability.name;
  //     }
  //     if (ability3) {
  //       ability3Resource = await P.resource(ability3.ability.url);
  //       formattedPokemon.ability3Description = removeLinebreaks(
  //         ability3Resource.effect_entries.find(o => o.language.name === 'en')
  //           .short_effect,
  //       );
  //       formattedPokemon.ability3 = ability3.ability.name;
  //     }

  //     formattedPokemon.id = pokemon.id;
  //     formattedPokemon.species = capitalizeFirstLetter(pokemon.name);
  //     if (query === 'meowstic-male' || query === 'meowstic-female') {
  //       formattedPokemon.species = 'Meowstic';
  //     }
  //     formattedPokemon.sprite = pokemon.sprites.front_default;
  //     formattedPokemon.sprites = getSprites(pokemon.sprites);
  //     if (pokemon.types.length > 1) {
  //       formattedPokemon.type1 = pokemon.types[1].type.name;
  //       formattedPokemon.type2 = pokemon.types[0].type.name;
  //     } else {
  //       formattedPokemon.type1 = pokemon.types[0].type.name;
  //     }
  //     formattedPokemon.pokedexEntry = removeLinebreaks(
  //       speciesInfo.flavor_text_entries.find(o => o.language.name === 'en')
  //         .flavor_text,
  //     );
  //     formattedPokemon.height = pokemon.height / 10;
  //     formattedPokemon.weight = pokemon.weight / 10;
  //     formattedPokemon.statHp = pokemon.stats.find(
  //       o => o.stat.name === 'attack',
  //     ).base_stat;
  //     formattedPokemon.statAttack = pokemon.stats.find(
  //       o => o.stat.name === 'attack',
  //     ).base_stat;
  //     formattedPokemon.statDefense = pokemon.stats.find(
  //       o => o.stat.name === 'defense',
  //     ).base_stat;
  //     formattedPokemon.statSpecialAttack = pokemon.stats.find(
  //       o => o.stat.name === 'special-attack',
  //     ).base_stat;
  //     formattedPokemon.statSpecialDefense = pokemon.stats.find(
  //       o => o.stat.name === 'special-defense',
  //     ).base_stat;
  //     formattedPokemon.statSpeed = pokemon.stats.find(
  //       o => o.stat.name === 'speed',
  //     ).base_stat;

  //     return formattedPokemon;
  //   } catch (error) {
  //     throw error;
  //   }
  // };
  const attributes = [
    'name',
    'species',
    'pokedexNumber',
    'ability1',
    'ability1Description',
    'ability2',
    'ability2Description',
    'ability3',
    'ability3Description',
    'sprite',
    'sprites',
    'type1',
    'type2',
    'pokedexEntry',
    'height',
    'weight',
    'statHp',
    'statAttack',
    'statDefense',
    'statSpecialAttack',
    'statSpecialDefense',
    'statSpeed',
  ];

  api.get('/raw/:id', async (req, res) => {
    try {
      const query = setQuery(req.params.id);
      const pokemon = await Pokemon.findOne({
        where: { pokedexNumber: req.params.id },
      });
      res.status(200).json(pokemon);
    } catch (error) {
      throw error;
      res.status(404).json({ message: error.message });
    }
  });

  const checkProperties = obj => {
    const tempObj = {};
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != '') {
        if (obj[key].name) {
          tempObj[key] = obj[key].name;
        } else {
          tempObj[key] = obj[key];
        }
      }
    }
    return tempObj;
  };

  const getEvolutions = evolutionChain => {
    let evolutions = [];
    const searchForEvolution = chain => {
      if (chain.evolves_to) {
        chain.evolves_to.forEach(data => {
          const evolution = {
            name: chain.species.name,
            evolvesTo: data.species.name,
            trigger: data.evolution_details[0].trigger.name,
          };
          delete data.evolution_details[0].trigger;
          evolution.value = checkProperties(data.evolution_details[0]);
          evolutions.push(evolution);
          if (data.evolves_to) {
            searchForEvolution(data);
          }
        });
      }
    };
    searchForEvolution(evolutionChain.chain);
    // console.log(evolutions);
    return evolutions;
  };

  api.get('/evolutions/:name', async (req, res) => {
    try {
      const userId = req.query.userId;
      const pokemon = await Pokemon.findOne({
        where: { name: req.params.name },
        attributes: [...attributes, 'chainId', 'jsonPokemon'],
      });
      if (pokemon) {
        const evolutionChain = await EvolutionChain.findOne({
          where: { chainId: pokemon.chainId },
        });
        const evolutions = getEvolutions(evolutionChain.json);
        delete pokemon.chainId;
        res.status(200).json(evolutions);
        Search.create({ userId, name: req.params.name });
      } else {
        res.status(200).json({ error: 'no pokemon named ' + req.params.name });
      }
    } catch (error) {
      throw error;
      res.status(404).json({ message: error.message });
    }
  });

  api.get('/one/:name', async (req, res) => {
    try {
      const userId = req.query.userId;
      const pokemon = await Pokemon.findOne({
        where: { name: req.params.name },
        attributes: attributes,
      });
      if (pokemon) {
        res.status(200).json(pokemon);
        Search.create({ userId, name: req.params.name });
      } else {
        res.status(200).json({ error: 'no pokemon named ' + req.params.name });
      }
    } catch (error) {
      throw error;
      res.status(404).json({ message: error.message });
    }
  });

  api.get('/id/:id', async (req, res) => {
    try {
      const query = setQuery(req.params.id);
      const userId = req.query.userId;
      const pokemon = await Pokemon.findOne({
        where: { pokedexNumber: req.params.id },
        attributes: attributes,
      });
      if (pokemon) {
        res.status(200).json(pokemon);
        Search.create({ userId, name: pokemon.name });
      } else {
        res.status(200).json({ error: 'no pokemon with id: ' + req.params.id });
      }
    } catch (error) {
      throw error;
      res.status(404).json({ message: error.message });
    }
  });

  api.get('/popular', async (req, res) => {
    try {
      const psqlQuery =
        'SELECT name, COUNT(*) FROM "Searches" GROUP BY name ORDER BY count DESC LIMIT 10';
      const results = await sequelize.query(psqlQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // map array to promises
      const promises = await results.map(async (result, i) => {
        const pokemon = await Pokemon.findOne({
          where: { name: result.name },
          attributes: attributes,
        });
        const pokemonData = pokemon.dataValues;
        pokemonData.count = result.count;
        pokemonData.rank = i + 1;
        return pokemonData;
      });
      const promisesAll = await Promise.all(promises);

      res.status(200).json(promisesAll);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  api.get('/random/:quantity', async (req, res) => {
    const idRange = {
      pokedexNumber: {
        $between: [1, 802],
      },
    };
    try {
      if (req.params.quantity == 1) {
        const randomPokemon = await Pokemon.findOne({
          where: idRange,
          order: [[sequelize.literal('random()')]],
          attributes: attributes,
        });
        res.status(200).json(randomPokemon);
      } else {
        const randomPokemon = await Pokemon.findAll({
          where: idRange,
          order: [[sequelize.literal('random()')]],
          limit: req.params.quantity,
          attributes: attributes,
        });
        res.status(200).json(randomPokemon);
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  return api;
};

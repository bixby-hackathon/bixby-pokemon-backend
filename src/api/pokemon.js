import { Router } from 'express';
import Axios from 'axios';
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

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

  api.get('/:name', async (req, res) => {
    try {
      console.log(req.params.name);
      const query = replaceSpaces(req.params.name);
      console.log(query);
      const pokemon = await P.getPokemonByName(query);
      const speciesInfo = await P.getPokemonSpeciesByName(query);
      const formattedPokemon = {};

      formattedPokemon.id = pokemon.id;
      formattedPokemon.species = capitalizeFirstLetter(pokemon.name);
      formattedPokemon.sprite = pokemon.sprites.front_default;
      formattedPokemon.sprites = getSprites(pokemon.sprites);
      // formattedPokemon.types = getTypes(pokemon.types);
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
      res.status(404).json({ message: 'error' });
    }
  });

  return api;
};

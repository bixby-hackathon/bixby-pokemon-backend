import { Router } from 'express';
import Axios from 'axios';
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

export default ({ config }) => {
  let api = Router();

  api.get('/:name', async (req, res) => {
    try {
      const pokemon = await P.getPokemonByName(req.params.name);
      const formattedPokemon = {};
      const speciesInfo = await P.getPokemonSpeciesByName(req.params.name);

      formattedPokemon.id = pokemon.id;
      formattedPokemon.sprite = pokemon.sprites.front_default;
      formattedPokemon.pokedexEntry = speciesInfo.flavor_text_entries.find(
        o => o.language.name === 'en',
      ).flavor_text;
      formattedPokemon.height = pokemon.height;
      formattedPokemon.weight = pokemon.weight;
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

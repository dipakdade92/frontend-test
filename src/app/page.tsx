"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const sortData = (data, column, direction) => {
  return data.slice().sort((a, b) => {
    if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
    if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const PokemonRow = ({ pokemon, onClick, details, rowIndex }) => (
  <tr
    onClick={() => onClick(pokemon.name, pokemon.url)}
    className={`cursor-pointer ${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
  >
    <td className="px-4 py-2 text-left">{pokemon.name}</td>
    {details && (
      <>
        <td className="px-4 py-2 text-center">{details.type}</td>
        <td className="px-4 py-2 text-center">
          <img src={details.image} alt={pokemon.name} className="w-12 h-12 mx-auto" />
        </td>
      </>
    )}
  </tr>
);

export default function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [expandedPokemons, setExpandedPokemons] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const fetchPokemon = useCallback(async (url = 'https://pokeapi.co/api/v2/pokemon') => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setPokemonList(prevList => {
        const newPokemons = response.data.results.filter(
          pokemon => !prevList.some(prev => prev.name === pokemon.name)
        );
        return [...prevList, ...newPokemons];
      });
      setNextUrl(response.data.next);
    } catch (error) {
      console.error("Failed to fetch Pokémon data", error);
    }
    setLoading(false);
  }, []);

  const fetchPokemonDetails = useCallback(async (url) => {
    try {
      const response = await axios.get(url);
      return {
        type: response.data.types.map(typeInfo => typeInfo.type.name).join(', '),
        image: response.data.sprites.front_default
      };
    } catch (error) {
      console.error("Failed to fetch Pokémon details", error);
      return { type: 'Unknown', image: '' };
    }
  }, []);

  const handleClick = useCallback(async (pokemonName, pokemonUrl) => {
    if (expandedPokemons[pokemonName]) return; 

    const details = await fetchPokemonDetails(pokemonUrl);
    setExpandedPokemons(prev => ({
      ...prev,
      [pokemonName]: details
    }));
  }, [expandedPokemons, fetchPokemonDetails]);

  const handleScroll = useCallback((event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    if (bottom && nextUrl && !loading) {
      fetchPokemon(nextUrl);
    }
  }, [nextUrl, loading, fetchPokemon]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  const filteredPokemonList = pokemonList.filter(pokemon => pokemon?.name?.toLowerCase().includes(search?.toLowerCase()));
  const sortedPokemonList = sortData(filteredPokemonList, sortColumn, sortDirection);
  const paginatedPokemonList = sortedPokemonList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };
  const handlePageChange = (direction) => {
    if (direction === 'prev' && page > 0) setPage(prev => prev - 1);
    if (direction === 'next' && page < Math.ceil(filteredPokemonList.length / rowsPerPage) - 1) setPage(prev => prev + 1);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-5 bg-gray-100 h-screen overflow-auto" onScroll={handleScroll}>
      <div className="flex justify-between items-center mb-5">
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="mb-5 p-2 border rounded-lg border-gray-300 bg-white"
        >
          {[5, 10, 25, 50].map(rows => (
            <option key={rows} value={rows}>
              {rows} rows
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={handleSearchChange}
          className="mb-5 p-2 border rounded-lg border-gray-300"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md border border-gray-300 rounded-lg mb-5 transform translate-y-1">
          <thead>
            <tr className="bg-gray-200">
              <th
                className="px-4 py-2 cursor-pointer hover:bg-gray-300 text-left"
                onClick={() => handleSort('name')}
              >
                Name
                {sortColumn === 'name' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
              {Object.keys(expandedPokemons).length > 0 && (
                <>
                  <th
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300 text-center"
                    onClick={() => handleSort('type')}
                  >
                    Type
                    {sortColumn === 'type' ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                  <th className="px-4 py-2 text-center">Image</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedPokemonList.map((pokemon, index) => (
              <PokemonRow
                key={pokemon.name}
                pokemon={pokemon}
                onClick={handleClick}
                details={expandedPokemons[pokemon.name]}
                rowIndex={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-center py-5">Loading...</div>}
      <div className="flex justify-center items-center mt-5">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100"
          onClick={() => handlePageChange('prev')}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="mx-4">{page + 1}</span>
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100"
          onClick={() => handlePageChange('next')}
          disabled={page >= Math.ceil(filteredPokemonList.length / rowsPerPage) - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

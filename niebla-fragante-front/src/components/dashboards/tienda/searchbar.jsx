import React from 'react';
import './searchbar.css';

export default function SearchBar({ valor, onChange }) {
  return (
    <div className="search-bar ">
      <input
        type="text"
        className="form-control custom-search"
        placeholder="Buscar productos..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

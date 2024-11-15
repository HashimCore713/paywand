'use client'

import React, { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import classes from './index.module.scss'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchQuery.trim() !== '') {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSearch}>
      <div className={classes.searchInputContainer}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={classes.searchButton} disabled={searchQuery.trim() === ''}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </form>
  )
}

export default SearchBar

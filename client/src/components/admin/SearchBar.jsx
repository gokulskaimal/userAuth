"use client"

import { useState } from "react"

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-input"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  )
}

export default SearchBar


import React, { useState, useEffect } from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  const [inputValue, setInputValue] = useState((page + 1).toString());

  useEffect(() => {
    setInputValue((page + 1).toString());
  }, [page]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const goToPage = () => {
    const newPage = parseInt(inputValue, 10) - 1;
    if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages && newPage !== page) {
      onPageChange(newPage);
    } else {
      setInputValue((page + 1).toString());
    }
  };

  const handleInputBlur = () => {
    goToPage();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      goToPage();
      e.target.blur();
    }
  };

  if (totalPages <= 0) return null;

  return (
    <div
      className="pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '20px',
      }}
    >
      <button
        className="pagination-button"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        style={{
          padding: '6px 12px',
          backgroundColor: page === 0 ? '#e0e0e0' : '#007bff',
          color: page === 0 ? '#888' : '#fff',
          cursor: page === 0 ? 'not-allowed' : 'pointer',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Anterior
      </button>

      <span>Página</span>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        style={{
          width: '50px',
          textAlign: 'center',
          padding: '4px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
        aria-label="Número da página"
      />

      <span>de {totalPages}</span>

      <button
        className="pagination-button"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        style={{
          padding: '6px 12px',
          backgroundColor: page >= totalPages - 1 ? '#e0e0e0' : '#007bff',
          color: page >= totalPages - 1 ? '#888' : '#fff',
          cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;

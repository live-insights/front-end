import React from "react";

const VehicleFilters = ({ filters, onChange, onSearch }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div className="filter-item">
          <label htmlFor="startDate">Início:</label>
          <input
            id="startDate"
            type="datetime-local"
            name="startDate"
            value={filters.startDate}
            onChange={onChange}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="endDate">Fim:</label>
          <input
            id="endDate"
            type="datetime-local"
            name="endDate"
            value={filters.endDate}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-item">
          <label htmlFor="fuelType">Combustível:</label>
          <select id="fuelType" name="fuelType" value={filters.fuelType} onChange={onChange}>
            <option value="ALL">Todos</option>
            <option value="GASOLINE">Gasolina</option>
            <option value="ETHANOL">Etanol</option>
            <option value="ELECTRIC">Elétrico</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="category">Categoria:</label>
          <select id="category" name="category" value={filters.category} onChange={onChange}>
            <option value="ALL">Todas</option>
            <option value="MOTORCYCLE">Moto</option>
            <option value="VAN">Van</option>
            <option value="TRUCK">Caminhonete</option>
            <option value="ECONOMY">Econômico</option>
            <option value="LUXURY">Luxo</option>
            <option value="SUV">SUV</option>
          </select>
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-item">
          <label htmlFor="startYear">Ano Inicial:</label>
          <input
            id="startYear"
            type="number"
            name="startYear"
            value={filters.startYear}
            onChange={onChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="endYear">Ano Final:</label>
          <input
            id="endYear"
            type="number"
            name="endYear"
            max={new Date().getFullYear()}
            value={filters.endYear}
            onChange={onChange}
          />
        </div>
      </div>

      <button className="search-button" onClick={onSearch}>
        Buscar
      </button>
    </div>
  );
};

export default VehicleFilters;

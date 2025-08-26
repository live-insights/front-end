import React from 'react';

const AnalysisGridTable = ({ items, loading }) => {
  if (loading) return <p>Carregando veículos...</p>;
  if (items.length === 0) return <p>Nenhum veículo encontrado.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Cor</th>
          <th>Ano</th>
          <th>Placa</th>
          <th>Combustível</th>
          <th>Categoria</th>
          <th>Valor da Diária</th>
        </tr>
      </thead>
      <tbody>
        {items.map(vehicle => (
          <tr key={vehicle.id}>
            <td>{vehicle.id}</td>
            <td>{vehicle.model}</td>
            <td>{vehicle.brand}</td>
            <td>{vehicle.color}</td>
            <td>{vehicle.year}</td>
            <td>{vehicle.licensePlate}</td>
            <td>{vehicle.fuelType}</td>
            <td>{vehicle.category}</td>
            <td>
            {vehicle.dailyRate
              ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(vehicle.dailyRate))
              : 'R$ 0,00'}
          </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnalysisGridTable;

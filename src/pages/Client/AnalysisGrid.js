import { useEffect, useState } from "react";
import { fetchAnalysisGrid, fetchItemImages as fetchItemImagesAPI } from "../../components/Client/api";
import VehicleCardGrid from "../../components/Client/VehicleCardGrid";
import VehicleFilters from "../../components/Client/VehicleFilters";
import Pagination from "../../components/Pagination";

const GRID_SIZE = 9;

const AnalysisGrid = () => {
  const nowPlus1h = new Date(Date.now() + 60 * 60 * 1000);
  const oneMonthLater = new Date(nowPlus1h.getTime() + 30 * 24 * 60 * 60 * 1000);

  /*Avaliar quais de fato são os atributos*/ 
  const [filters, setFilters] = useState({
    startDate: nowPlus1h.toISOString().slice(0, 16),
    endDate: oneMonthLater.toISOString().slice(0, 16),
    fuelType: "ALL",
    startYear: "",
    endYear: "",
    category: "ALL",
  });

  const [items, setitems] = useState([]);
  const [itemImages, setItemImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadItemImages = async (vehicleList) => {
    try {
      const imagesMap = {};
      const imagePromises = vehicleList.map(async (vehicle) => {
        const images = await fetchItemImagesAPI(vehicle.id);
        imagesMap[vehicle.id] = images;
      });

      await Promise.all(imagePromises);
      setItemImages(imagesMap);
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    }
  };

  const fetchitems = async (targetPage = 0) => {
    setLoading(true);

    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      alert("Datas inválidas. Verifique o período selecionado.");
      setLoading(false);
      return;
    }

    try {
      /*Avaliar quais de fato são os atributos*/
      const result = await fetchAnalysisGrid({
        startDate: start,
        endDate: end,
        fuelType: filters.fuelType === "ALL" ? undefined : filters.fuelType,
        category: filters.category === "ALL" ? undefined : filters.category,
        startYear: filters.startYear ? parseInt(filters.startYear) : undefined,
        endYear: filters.endYear ? parseInt(filters.endYear) : undefined,
        page: targetPage,
        size: GRID_SIZE,
      });

      setitems(result.content);
      setTotalPages(result.totalPages);
      await loadItemImages(result.content);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPage(0);
    fetchitems(0);
  };

  useEffect(() => {
    if (page > 0) {
      fetchitems(page);
    }
  }, [page]);

  useEffect(() => {
    fetchitems(0);
  }, []);

  return (
    <div className="available-items-container">
      <h3>Análises</h3>

      <VehicleFilters
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <VehicleCardGrid
        items={items}
        itemImages={itemImages}
        loading={loading}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AnalysisGrid;

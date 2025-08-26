// src/components/Client/api.js
import { apiRequest } from '../../utils/request';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

// ========== VEHICLE SEARCH API ==========
const fetchAnalysisGrid = async ({
  startDate = new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  endDate = new Date(Date.now() + 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000), // +1 month
  fuelType,
  startYear,
  endYear,
  category,
  page = 0,
  size = 10,
} = {}) => {
  try {
    const requestBody = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(fuelType && { fuelType }),
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(category && { category }),
    };

    const queryParams = new URLSearchParams({ page, size }).toString();
    const response = await apiRequest(`${BASE_URL}/rentals/available?${queryParams}`, 'POST', requestBody);
    console.log(response)
    return response; 
  } catch (error) {
    console.error("fetchAnalysisGrid error:", error);
    return { content: [], totalPages: 0 };
  }
};

const fetchItemImages = (vehicleId) =>
  apiRequest(`${BASE_URL}/vehicle-images/vehicle/${vehicleId}`);

export {
  fetchAnalysisGrid,
  fetchItemImages
};

export const apiRequest = async (url, method = 'GET', body = undefined) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: body ? JSON.stringify(body) : undefined,
        withCredentials: true
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro desconhecido');
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
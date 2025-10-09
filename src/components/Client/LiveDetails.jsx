import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { fetchLives, fetchComments, startLive, stopLive } from './api.js';

const LiveDetails = () => {
  const { liveId } = useParams();
  const [live, setLive] = useState(null);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("Inativo");
  const [search, setSearch] = useState("");

  const [sentimentChart, setSentimentChart] = useState(null);
  const [timelineChart, setTimelineChart] = useState(null);
  const [interactionChart, setInteractionChart] = useState(null);
  const [dashboardIndex, setDashboardIndex] = useState(0);

  // Filtros
  const [sentimentFilter, setSentimentFilter] = useState([]);
  const [interactionFilter, setInteractionFilter] = useState([]);

  // Estado para controlar se a live está iniciando (apenas UI feedback)
  const [starting, setStarting] = useState(false);

  const dashboards = ["timelineChart", "interactionChart", "sentimentChart"];

  // Mapear status da API para formato de exibição
  const mapApiStatus = (apiStatus) => {
    const statusMap = {
      'ATIVO': 'Ativo',
      'INATIVO': 'Inativo',
      'FINALIZADO': 'Finalizado'
    };
    return statusMap[apiStatus] || 'Inativo';
  };

  // Buscar informações da live e status - SEMPRE da API
  const fetchLiveInfo = async () => {
    if (!liveId) return;

    try {
      const lives = await fetchLives();
      const found = lives.find(l => l.liveId === liveId);

      setLive(found);

      // SEMPRE usar o status da API como fonte da verdade
      const apiStatus = mapApiStatus(found?.status);
      setStatus(apiStatus);

      console.log(`Live ${liveId} status from API: ${found?.status} -> ${apiStatus}`);
    } catch (error) {
      console.error('Error fetching live info:', error);
    }
  };

  // Buscar comentários da live
  const fetchCommentsData = async () => {
    if (!liveId) return;

    try {
      const commentsData = await fetchComments(liveId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Buscar dados da live e comentários na inicialização
  useEffect(() => {
    fetchLiveInfo();
    fetchCommentsData();
  }, [liveId]);

  // Atualizar dados a cada 10 segundos enquanto estiver ativo
  useEffect(() => {
    if (status === "Ativo") {
      const interval = setInterval(() => {
        // Salvar posição do scroll antes de atualizar dados
        const scrollPos = window.scrollY;

        // Recarregar os dados
        fetchLiveInfo();
        fetchCommentsData();

        // Restaurar scroll após um pequeno delay
        setTimeout(() => {
          window.scrollTo(0, scrollPos);
        }, 100);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [status, liveId]);

  // Atualizar gráficos quando os comentários mudam
  useEffect(() => {
    if (comments.length === 0) return;
    buildInteractionChart(comments);
    buildTimelineChart(comments);
    buildSentimentChart(comments);
  }, [comments]);

  // Mostrar o dashboard selecionado
  useEffect(() => {
    showDashboard(dashboardIndex);
  }, [dashboardIndex]);

  // Função para iniciar a live
  const handleStartLive = async () => {
    try {
      setStarting(true); // mostra spinner e desabilita botão
      const result = await startLive(liveId);
      alert(result);

      // Recarregar dados da API para obter o status atualizado
      await fetchLiveInfo();

    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar a live.");
    } finally {
      setStarting(false);
    }
  };

  // Função para parar a live
  const handleStopLive = async () => {
    try {
      const result = await stopLive();
      alert(result);

      // Recarregar dados da API para obter o status atualizado
      await fetchLiveInfo();

    } catch (err) {
      console.error(err);
      alert("Erro ao parar a live.");
    }
  };

  // Formatar textos de enum para exibição
  const formatEnum = (val) =>
    val?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || "-";

  // Mostrar apenas o dashboard selecionado
  const showDashboard = (index) => {
    dashboards.forEach((id, i) => {
      const canvas = document.getElementById(id);
      if (canvas) canvas.style.display = i === index ? "block" : "none";
    });
  };

  // Construir gráfico de sentimento
  const buildSentimentChart = (comments) => {
    const ctx = document.getElementById("sentimentChart")?.getContext("2d");
    if (!ctx) return;

    const counts = comments.reduce((acc, c) => {
      const s = c.sentiment || "Indefinido";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(counts).map(formatEnum),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ["#FFEB8A", "#F57C1F", "#F59A55"]
      }]
    };

    if (sentimentChart) {
      sentimentChart.data = data;
      sentimentChart.update();
    } else {
      const newChart = new Chart(ctx, { type: "pie", data });
      setSentimentChart(newChart);
    }
  };

  // Construir gráfico de timeline
  const buildTimelineChart = (comments) => {
    const ctx = document.getElementById("timelineChart")?.getContext("2d");
    if (!ctx) return;

    const buckets = {}, positives = {}, negatives = {}, neutrals = {};

    comments.forEach(c => {
      const time = new Date(c.commentsDetailsData?.commentTimeStamp);
      const key = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sentiment = c.sentiment?.toLowerCase();

      buckets[key] = (buckets[key] || 0) + 1;
      if (sentiment === "positivo") positives[key] = (positives[key] || 0) + 1;
      else if (sentiment === "negativo") negatives[key] = (negatives[key] || 0) + 1;
      else neutrals[key] = (neutrals[key] || 0) + 1;
    });

    const labels = Array.from(new Set([
      ...Object.keys(buckets),
      ...Object.keys(positives),
      ...Object.keys(negatives),
      ...Object.keys(neutrals)
    ])).sort();

    const data = {
      labels,
      datasets: [
        {
          label: "Total",
          data: labels.map(k => buckets[k] || 0),
          borderColor: "#9C27B0",        // Roxo forte
          backgroundColor: "#CE93D8",    // Roxo claro
          fill: false,
          borderWidth: 3,
        },
        {
          label: "Positivos",
          data: labels.map(k => positives[k] || 0),
          borderColor: "#2196F3",        // Azul forte
          backgroundColor: "#90CAF9",    // Azul claro
          fill: false,
          borderWidth: 2,
        },
        {
          label: "Negativos",
          data: labels.map(k => negatives[k] || 0),
          borderColor: "#FF5722",        // Laranja forte
          backgroundColor: "#FFAB91",    // Laranja claro
          fill: false,
          borderWidth: 2,
        },
        {
          label: "Neutros",
          data: labels.map(k => neutrals[k] || 0),
          borderColor: "#607D8B",        // Azul acinzentado
          backgroundColor: "#B0BEC5",    // Azul acinzentado claro
          fill: false,
          borderWidth: 2,
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#333",
            font: {
              size: 13,
              weight: "600",
            },
          },
        },
        title: {
          display: true,
          text: "Evolução dos Comentários ao Longo do Tempo",
          color: "#9C27B0", // título em roxo
          font: {
            size: 18,
            weight: "bold",
          },
          padding: { top: 10, bottom: 30 },
        },
        tooltip: {
          backgroundColor: "#333",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#9C27B0",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: {
            color: "#444",
            font: { size: 12 },
          },
        },
        y: {
          grid: { color: "rgba(0,0,0,0.1)" },
          ticks: {
            color: "#444",
            font: { size: 12 },
            stepSize: 1,
          },
        },
      },
      elements: {
        line: {
          tension: 0.35, // suaviza as linhas
        },
        point: {
          radius: 4,
          backgroundColor: "#fff",
          borderWidth: 2,
          hoverRadius: 6,
        },
      },
    };

    if (timelineChart) {
      timelineChart.data = data;
      timelineChart.options = options;
      timelineChart.update();
    } else {
      const newChart = new Chart(ctx, { type: "line", data, options });
      setTimelineChart(newChart);
    }
  };

  // Construir gráfico de interação
  const buildInteractionChart = (comments) => {
    const ctx = document.getElementById("interactionChart")?.getContext("2d");
    if (!ctx) return;

    const types = comments.reduce((acc, c) => {
      const type = c.interaction || "Outro";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(types).map(formatEnum),
      datasets: [{
        data: Object.values(types),
        backgroundColor: "#F57C1F"
      }]
    };

    if (interactionChart) {
      interactionChart.data = data;
      interactionChart.update();
    } else {
      const newChart = new Chart(ctx, { type: "bar", data });
      setInteractionChart(newChart);
    }
  };

  // Filtrar comentários pelo texto buscado
  const getUniqueOptions = (array, key) => {
    const unique = Array.from(new Set(array.map(item => item[key])));
    return unique
      .filter(Boolean)
      .map(val => ({ value: val, label: formatEnum(val) }));
  };

  const sentimentOptions = getUniqueOptions(comments, 'sentiment');
  const interactionOptions = getUniqueOptions(comments, 'interaction');

  const filteredComments = comments.filter(c => {
    const contentMatch = c.commentsDetailsData?.commentContent?.toLowerCase().includes(search.toLowerCase());

    const sentimentMatch =
      sentimentFilter.length === 0 || sentimentFilter.map(f => f.value).includes(c.sentiment);

    const interactionMatch =
      interactionFilter.length === 0 || interactionFilter.map(f => f.value).includes(c.interaction);

    return contentMatch && sentimentMatch && interactionMatch;
  });


  const toggleFilter = (value, filter, setFilter) => {
    if (filter.includes(value)) {
      setFilter(filter.filter(f => f !== value));
    } else {
      setFilter([...filter, value]);
    }
  };

  if (!live) return <div>Carregando live...</div>;

  return (
    <div className="live-details" style={styles.liveDetails}>
      <header>
        <h2 style={styles.text}>[{live.tag?.name || "Sem Tag"}] {live.title}</h2>
        <p>ID: {liveId} | Status: {status} | Comentários: {comments.length}</p>

        <div className="live-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Botão para iniciar live */}
          <button
            onClick={handleStartLive}
            disabled={status === "Ativo" || starting}
            title="Iniciar Análise"
            className="start-btn"
          >
            {starting || status === "Ativo" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 50 50"
                className="spinner"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="31.415, 31.415"
                  strokeDashoffset="0"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M10.804 8.697L5.437 12.066A.5.5 0 0 1 4.5 11.617V4.383a.5.5 0 0 1 .937-.449l5.367 3.37a.5.5 0 0 1 0 .893z" />
              </svg>
            )}
          </button>

          {/* Botão para parar live */}
          <button
            onClick={handleStopLive}
            disabled={starting}
            title="Parar Análise"
            className="stop-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 4.5A1.5 1.5 0 0 0 4 6v4a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 10V6a1.5 1.5 0 0 0-1.5-1.5h-5z" />
            </svg>
          </button>
        </div>
      </header>

      <section className="dashboard">
        <div className="charts-wrapper">
          <canvas id="timelineChart" />
          <canvas id="interactionChart" style={{ display: "none" }} />
          <canvas id="sentimentChart" style={{ display: "none" }} />
        </div>

        <div className="nav-buttons" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '20px',
        }}>
          <button
            style={styles.buttonStyle}
            onClick={() => setDashboardIndex((dashboardIndex - 1 + dashboards.length) % dashboards.length)}
          >
            Anterior
          </button>
          <button
            style={styles.buttonStyle}
            onClick={() => setDashboardIndex((dashboardIndex + 1) % dashboards.length)}
          >
            Próximo
          </button>
        </div>

      </section>

      <section className="comments">
        <input
          type="text"
          placeholder="Buscar comentários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '2px solid #f59a55',
            marginTop: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            outline: 'none',
            background: 'white',
            color: '#334155'
          }}
        />
        <div>
          <table style={styles.commentsTable}>
            <thead>
              <tr>
                <th style={styles.th}>Horário</th>
                <th style={styles.th}>Autor</th>
                <th style={styles.th}>Comentário</th>

                <th style={styles.th}>
                  <div style={{ minWidth: '180px' }}>
                    <div style={styles.selectLabel}>Sentimento</div>
                    <Select
                      isMulti
                      options={sentimentOptions}
                      value={sentimentFilter}
                      onChange={setSentimentFilter}
                      placeholder="Todos"
                      styles={styles}
                    />
                  </div>
                </th>

                <th style={styles.th}>
                  <div style={{ minWidth: '180px' }}>
                    <div style={styles.selectLabel}>Interação</div>
                    <Select
                      isMulti
                      options={interactionOptions}
                      value={interactionFilter}
                      onChange={setInteractionFilter}
                      placeholder="Todos"
                      styles={styles}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((c, idx) => {
                const baseColor = idx % 2 === 0 ? 'white' : '#fff7e6';
                return (
                  <tr
                    key={idx}
                    onClick={() => window.open(c.authorDetailsData?.channelUrl, '_blank', 'noopener,noreferrer')}
                    style={{
                      backgroundColor: baseColor,
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffe9cc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = baseColor;
                    }}
                  >
                    <td style={styles.td}>
                      {new Date(c.commentsDetailsData?.commentTimeStamp).toLocaleTimeString()}
                    </td>
                    <td style={styles.td}>{c.authorDetailsData?.userDisplayName}</td>
                    <td style={styles.td}>{c.commentsDetailsData?.commentContent}</td>
                    <td style={styles.td}>{formatEnum(c.sentiment)}</td>
                    <td style={styles.td}>{formatEnum(c.interaction)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const styles = {
  text: {
    color: '#334155'
  },
  buttonStyle: {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #FF5722, #9C27B0)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  },
  buttonHover: {
    backgroundColor: '#e66d0c',
  },
  liveDetails: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    color: 'black',
    padding: '20px',
  },
  commentsTable: {
    width: '100%',
    marginTop: '70px',
    borderCollapse: 'separate',
    borderSpacing: 0,
    border: '1px solid #f59a55',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#fff3db',
    color: '#333',
    textAlign: 'left',
    padding: '12px 15px',
    borderBottom: '2px solid #f57c1f',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ffe0b3',
    color: '#555',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',  
    maxWidth: '300px',  
  },
  control: (base) => ({
    ...base,
    minHeight: '34px',
    borderRadius: '6px',
    borderColor: '#f59a55',
    boxShadow: 'none',
    fontSize: '13px',
    cursor: 'pointer'
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#ffe9cc',
    color: '#000',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#999',
  }),
  selectLabel: {
    fontWeight: '600',
    fontSize: '13px',
    marginBottom: '6px',
    color: '#334155',
  }
};


export default LiveDetails;
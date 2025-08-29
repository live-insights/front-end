import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { fetchLives, fetchComments } from './api.js';

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

  const dashboards = ["timelineChart", "interactionChart", "sentimentChart"];

  useEffect(() => {
    if (!liveId) return;

    const fetchLiveInfo = async () => {
      const lives = await fetchLives();
      const found = lives.find(l => l.liveId === liveId);
      setLive(found);
      setStatus(found?.status || "Inativo");
    };

    const fetchCommentsData = async () => {
      const commentsData = await fetchComments(liveId);
      setComments(commentsData);
    };

    fetchLiveInfo();
    fetchCommentsData();
  }, [liveId]);

  useEffect(() => {
    if (comments.length === 0) return;
    buildInteractionChart(comments);
    buildTimelineChart(comments);
    buildSentimentChart(comments);
  }, [comments]);

  useEffect(() => {
    showDashboard(dashboardIndex);
  }, [dashboardIndex]);

  const formatEnum = (val) =>
    val?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || "-";

  const showDashboard = (index) => {
    dashboards.forEach((id, i) => {
      const canvas = document.getElementById(id);
      if (canvas) canvas.style.display = i === index ? "block" : "none";
    });
  };

  const buildSentimentChart = (comments) => {
    const ctx = document.getElementById("sentimentChart").getContext("2d");
    const counts = comments.reduce((acc, c) => {
      const s = c.sentiment || "Indefinido";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const data = {
      labels: Object.keys(counts).map(formatEnum),
      datasets: [{ data: Object.values(counts), backgroundColor: ["#FFEB8A", "#F57C1F", "#F59A55"] }]
    };
    if (sentimentChart) {
      sentimentChart.data = data;
      sentimentChart.update();
    } else {
      const newChart = new Chart(ctx, { type: "pie", data });
      setSentimentChart(newChart);
    }
  };

  const buildTimelineChart = (comments) => {
    const ctx = document.getElementById("timelineChart").getContext("2d");
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
    const labels = Array.from(new Set([...Object.keys(buckets), ...Object.keys(positives), ...Object.keys(negatives), ...Object.keys(neutrals)])).sort();
    const data = {
      labels,
      datasets: [
        { label: "Total", data: labels.map(k => buckets[k] || 0), borderColor: "white", fill: false },
        { label: "Positivos", data: labels.map(k => positives[k] || 0), borderColor: "#00C853", fill: false },
        { label: "Negativos", data: labels.map(k => negatives[k] || 0), borderColor: "#D50000", fill: false },
        { label: "Neutros", data: labels.map(k => neutrals[k] || 0), borderColor: "#FFAB00", fill: false }
      ]
    };
    if (timelineChart) {
      timelineChart.data = data;
      timelineChart.update();
    } else {
      const newChart = new Chart(ctx, { type: "line", data, options: { responsive: true } });
      setTimelineChart(newChart);
    }
  };

  const buildInteractionChart = (comments) => {
    const ctx = document.getElementById("interactionChart").getContext("2d");
    const types = comments.reduce((acc, c) => {
      const type = c.interaction || "Outro";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const data = {
      labels: Object.keys(types).map(formatEnum),
      datasets: [{ data: Object.values(types), backgroundColor: "#F57C1F" }]
    };
    if (interactionChart) {
      interactionChart.data = data;
      interactionChart.update();
    } else {
      const newChart = new Chart(ctx, { type: "bar", data });
      setInteractionChart(newChart);
    }
  };

  const filteredComments = comments.filter(c =>
    c.commentsDetailsData?.commentContent?.toLowerCase().includes(search.toLowerCase())
  );

  if (!live) return <div>Carregando live...</div>;

  return (
    <div className="live-details">
      <header>
        <h2>[{live.tag?.name || "Sem Tag"}] {live.title}</h2>
        <p>ID: {liveId} | Status: {formatEnum(status)} | Comentários: {comments.length}</p>
      </header>

      <section className="dashboard">
        <div className="charts-wrapper">
          <canvas id="timelineChart" />
          <canvas id="interactionChart" style={{ display: "none" }} />
          <canvas id="sentimentChart" style={{ display: "none" }} />
        </div>

        <div className="nav-buttons">
          <button onClick={() => setDashboardIndex((dashboardIndex - 1 + dashboards.length) % dashboards.length)}>Anterior</button>
          <button onClick={() => setDashboardIndex((dashboardIndex + 1) % dashboards.length)}>Próximo</button>
        </div>
      </section>

      <section className="comments">
        <input
          type="text"
          placeholder="Buscar comentários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Horário</th>
              <th>Autor</th>
              <th>Comentário</th>
              <th>Sentimento</th>
              <th>Interação</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((c, idx) => (
              <tr key={idx}>
                <td>{new Date(c.commentsDetailsData?.commentTimeStamp).toLocaleTimeString()}</td>
                <td>{c.authorDetailsData?.userDisplayName}</td>
                <td>{c.commentsDetailsData?.commentContent}</td>
                <td>{formatEnum(c.sentiment)}</td>
                <td>{formatEnum(c.interaction)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LiveDetails;

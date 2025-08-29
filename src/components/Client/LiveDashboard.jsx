import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  fetchTags,
  fetchLives,
  createLive,
  updateLiveTitle,
  deleteLiveById,
  updateLiveTag
} from './api';

const LiveDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [livesGrouped, setLivesGrouped] = useState({});
  const [title, setTitle] = useState('');
  const [liveId, setLiveId] = useState('');
  const [tagSelect, setTagSelect] = useState('');
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTags();
    loadLives();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await fetchTags();
      setTags(tags);
    } catch (err) {
      alert('Erro ao carregar tags.');
      console.error(err);
    }
  };

  const loadLives = async () => {
    try {
      const lives = await fetchLives();
      const grouped = lives.reduce((acc, live) => {
        const tag = live.tag?.name || 'Sem Tag';
        acc[tag] = acc[tag] || [];
        acc[tag].push(live);
        return acc;
      }, {});
      setLivesGrouped(grouped);
    } catch (err) {
      alert('Erro ao carregar lives.');
      console.error(err);
    }
  };

  const handleAddLive = async () => {
    const tagName = tagSelect === '__new__' ? newTag.trim() : tagSelect;

    if (!liveId || !title || !tagName) {
      return alert('Preencha todos os campos.');
    }

    try {
      await createLive({ liveId, title, tagName });
      alert('Transmissão cadastrada com sucesso!');
      setModalOpen(false);
      setLiveId('');
      setTitle('');
      setTagSelect('');
      setNewTag('');
      loadLives();
    } catch (err) {
      alert(err.message || 'Erro ao cadastrar transmissão.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta live?')) return;
    try {
      await deleteLiveById(id);
      loadLives();
    } catch (err) {
      alert('Erro ao deletar live.');
    }
  };

  const handleEdit = async (id, currentTitle) => {
    const newTitle = prompt('Novo título:', currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    try {
      await updateLiveTitle(id, newTitle);
      loadLives();
    } catch (err) {
      alert('Erro ao atualizar título.');
    }
  };

  const handleUpdateTag = async (id) => {
    const newTag = prompt('Digite a nova tag:');
    if (!newTag?.trim()) return;
    try {
      await updateLiveTag(id, newTag);
      loadLives();
    } catch (err) {
      alert('Erro ao atualizar tag.');
    }
  };

  return (
    <div className="layout">
      <header className="header-top">
        <div className="header-div">
        <h2>Relatórios</h2>
        <button className="input-button" onClick={() => setModalOpen(true)}>
          {window.innerWidth <= 600 ? '+' : 'NOVA LIVE'}
        </button>
        </div>
      </header>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="remove-button" onClick={() => setModalOpen(false)}>×</button>

            <label>Título:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>ID da Live:</label>
            <input value={liveId} onChange={(e) => setLiveId(e.target.value)} />

            <label>Tag:</label>
            <select value={tagSelect} onChange={(e) => setTagSelect(e.target.value)}>
              <option value="" disabled>Escolha uma tag</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
              <option value="__new__">Criar nova tag...</option>
            </select>

            {tagSelect === '__new__' && (
              <input
                placeholder="Insira nova tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
            )}

            <button className="input-button" onClick={handleAddLive}>ADICIONAR</button>
          </div>
        </div>
      )}

      <div>
        {Object.entries(livesGrouped).map(([tag, lives]) => (
          <div key={tag}>
            <h3>{tag.toUpperCase()}</h3>
            <div className="card-grid">
              {lives.map((live) => (
                <div
                key={live.liveId}
                className="live-card"
                onClick={() => navigate(`${live.liveId}`)}
              >
                <img
                  src={`https://img.youtube.com/vi/${live.liveId}/0.jpg`}
                  alt="Thumbnail"
                  className="live-thumbnail"
                />
              
                <div className="live-info">
                  <div>
                    <strong>[{tag.toUpperCase()}]</strong> {live.title}
                  </div>
                  <small>{new Date(live.date || live.createdAt).toLocaleDateString()}</small>
                </div>
              
                <div className="actions">
                  <button onClick={(e) => { e.stopPropagation(); handleUpdateTag(live.liveId); }}>Tag</button>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(live.liveId, live.title); }}>Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(live.liveId); }}>Apagar</button>
                </div>
              </div>              
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDashboard;

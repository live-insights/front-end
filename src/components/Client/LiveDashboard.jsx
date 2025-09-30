import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderTop from '../../components/HeaderTop';

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

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="currentColor"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const TagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="layout" style={styles.container}>
      <HeaderTop onAddLiveClick={() => setModalOpen(true)} />

      {modalOpen && (
        <div className="modal" style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-content" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Nova Transmissão</h2>
              <button className="remove-button" style={styles.closeButton} onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Título da Live</label>
                <input 
                  style={styles.input}
                  placeholder="Digite o título da live"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>ID da Live</label>
                <input 
                  style={styles.input}
                  placeholder="Ex: dQw4w9WgXcQ"
                  value={liveId} 
                  onChange={(e) => setLiveId(e.target.value)} 
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tag</label>
                <select style={styles.select} value={tagSelect} onChange={(e) => setTagSelect(e.target.value)}>
                  <option value="" disabled>Escolha uma tag</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                  <option value="__new__">+ Criar nova tag</option>
                </select>
              </div>

              {tagSelect === '__new__' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nova Tag</label>
                  <input
                    style={styles.input}
                    placeholder="Digite o nome da nova tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                </div>
              )}

              <button className="input-button" style={styles.submitButton} onClick={handleAddLive}>
                Adicionar Transmissão
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={styles.main}>
        <div style={styles.content}>
          {Object.entries(livesGrouped).length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>📺</div>
              <h3 style={styles.emptyStateTitle}>Nenhuma live encontrada</h3>
              <p style={styles.emptyStateText}>Comece adicionando sua primeira transmissão</p>
            </div>
          ) : (
            Object.entries(livesGrouped).map(([tag, lives]) => (
              <div key={tag} style={styles.section}>
                <h3 style={styles.sectionTitle}>{tag.toUpperCase()}</h3>
                <div className="card-grid" style={styles.cardGrid}>
                  {lives.map((live) => (
                    <div
                      key={live.liveId}
                      className="live-card"
                      style={styles.liveCard}
                      onClick={() => navigate(`${live.liveId}`)}
                    >
                      <div style={styles.thumbnailContainer}>
                        <img
                          src={`https://img.youtube.com/vi/${live.liveId}/0.jpg`}
                          alt="Thumbnail"
                          className="live-thumbnail"
                          style={styles.thumbnail}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3Lnczb3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTE0MCA4MEwxODAgMTAwTDE0MCAxMjBWODBaIiBmaWxsPSIjRDVEOUREIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div style={styles.playOverlay} className="play-overlay">▶</div>
                      </div>
                    
                      <div className="live-info" style={styles.cardContent}>
                        <div style={styles.cardInfo}>
                          <div>
                            <strong>[{tag.toUpperCase()}]</strong> {live.title}
                          </div>
                          <small style={styles.cardDate}>{new Date(live.date || live.createdAt).toLocaleDateString()}</small>
                        </div>
                      
                        <div className="actions" style={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUpdateTag(live.liveId); }}
                            style={styles.actionButton}
                            title="Alterar tag"
                          >
                            <TagIcon />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(live.liveId, live.title); }}
                            style={styles.actionButton}
                            title="Editar título"
                          >
                            <EditIcon />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(live.liveId); }}
                            style={{...styles.actionButton, ...styles.deleteButton}}
                            title="Deletar live"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>              
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FF5722 0%, #9C27B0 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  main: {
    padding: '120px 0 40px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  section: {
    marginBottom: '50px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '20px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  liveCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    background: '#f3f4f6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  cardContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '120px',
  },
  cardInfo: {
    marginBottom: '12px',
  },
  cardDate: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    background: '#f1f5f9',
    color: '#1E293B',
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'white',
  },
  emptyStateIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  emptyStateTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  emptyStateText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.8)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    animation: 'fadeIn 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748B',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1E293B',
  },
  input: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
  },
  submitButton: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #FF5722, #9C27B0)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(156,39,176,0.25)',
  },
};


export default LiveDashboard;
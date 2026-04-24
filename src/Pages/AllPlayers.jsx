import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Styles ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  .ap-wrap {
    min-height: 100vh;
    background: #0a1a0f;
    position: relative;
    overflow: hidden;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    color: #f0fdf4;
  }

  /* ── Pitch background ── */
  .ap-pitch {
    position: fixed;
    inset: 0;
    opacity: 0.045;
    pointer-events: none;
    z-index: 0;
  }

  .ap-glow {
    position: fixed;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, #22c55e20 0%, transparent 65%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .ap-header {
    position: relative;
    z-index: 2;
    padding: 2.5rem 2.5rem 1.5rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ap-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff08;
    border: 0.5px solid #ffffff14;
    border-radius: 100px;
    padding: 7px 16px;
    font-size: 13px;
    color: #6b7280;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .ap-back:hover {
    background: #22c55e18;
    color: #4ade80;
    border-color: #22c55e36;
  }

  .ap-title-block { flex: 1; }

  .ap-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #4ade80;
    margin-bottom: 4px;
  }

  .ap-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(38px, 6vw, 60px);
    line-height: 0.95;
    color: #f0fdf4;
    letter-spacing: 0.02em;
    margin: 0;
  }

  .ap-title-accent { color: #4ade80; }

  .ap-count {
    margin-top: 8px;
    font-size: 13px;
    color: #4b5563;
    font-weight: 300;
  }

  /* ── Divider ── */
  .ap-divider {
    position: relative;
    z-index: 2;
    margin: 0 2.5rem 2rem;
    height: 0.5px;
    background: #22c55e20;
  }

  /* ── Grid ── */
  .ap-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
    padding: 0 2.5rem 3rem;
  }

  /* ── Player card ── */
  .ap-card {
    background: #ffffff06;
    border: 0.5px solid #22c55e18;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    display: flex;
    flex-direction: column;
  }

  .ap-card:hover {
    border-color: #22c55e50;
    background: #22c55e08;
  }

  .ap-card:hover .ap-img-wrap::after {
    opacity: 1;
  }

  /* ── Image zone ── */
  .ap-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: #0f2b16;
    overflow: hidden;
  }

  .ap-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #0a1a0f88 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .ap-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.4s ease;
  }

  .ap-card:hover .ap-img {
    transform: scale(1.05);
  }

  .ap-no-img {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #0f2b16;
  }

  .ap-no-img-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #22c55e14;
    border: 0.5px solid #22c55e30;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ap-no-img-text {
    font-size: 11px;
    color: #374151;
    letter-spacing: 0.05em;
  }

  /* ── Number badge ── */
  .ap-num {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    background: #0a1a0fcc;
    border: 0.5px solid #22c55e30;
    border-radius: 100px;
    padding: 2px 9px;
    font-size: 11px;
    font-weight: 500;
    color: #4ade80;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Card body ── */
  .ap-card-body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
  }

  .ap-player-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 0.04em;
    color: #f0fdf4;
    line-height: 1;
    margin: 0;
  }

  .ap-team {
    font-size: 12px;
    color: #4b5563;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .ap-team-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
  }

  .ap-nationality {
    margin-top: 2px;
    font-size: 11px;
    color: #374151;
    font-weight: 300;
  }

  /* ── Loading overlay ── */
  .ap-loading {
    position: fixed;
    inset: 0;
    background: #0a1a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    gap: 20px;
  }

  .ap-ball {
    width: 48px;
    height: 48px;
    animation: ap-bounce 0.55s ease-in-out infinite alternate;
  }

  @keyframes ap-bounce {
    from { transform: translateY(-12px); }
    to   { transform: translateY(12px); }
  }

  .ap-loading-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.12em;
    color: #4ade80;
  }

  /* ── Empty state ── */
  .ap-empty {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 16px;
    text-align: center;
    padding: 2rem;
  }

  .ap-empty-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    letter-spacing: 0.05em;
    color: #374151;
  }

  .ap-empty-sub {
    font-size: 14px;
    color: #374151;
    font-weight: 300;
  }

  @media (max-width: 600px) {
    .ap-header { padding: 1.5rem 1.25rem 1rem; }
    .ap-divider { margin: 0 1.25rem 1.5rem; }
    .ap-grid { padding: 0 1.25rem 2rem; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  }
`;

/* ─── SVG helpers ─── */
const PitchSVG = () => (
  <svg className="ap-pitch" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="30" width="680" height="540" fill="none" stroke="white" strokeWidth="1.5" />
    <line x1="400" y1="30" x2="400" y2="570" stroke="white" strokeWidth="1" />
    <circle cx="400" cy="300" r="90" fill="none" stroke="white" strokeWidth="1" />
    <circle cx="400" cy="300" r="4" fill="white" />
    <rect x="60" y="180" width="115" height="240" fill="none" stroke="white" strokeWidth="1" />
    <rect x="625" y="180" width="115" height="240" fill="none" stroke="white" strokeWidth="1" />
    <rect x="60" y="235" width="50" height="130" fill="none" stroke="white" strokeWidth="1" />
    <rect x="690" y="235" width="50" height="130" fill="none" stroke="white" strokeWidth="1" />
    <path d="M175 180 Q220 300 175 420" fill="none" stroke="white" strokeWidth="1" />
    <path d="M625 180 Q580 300 625 420" fill="none" stroke="white" strokeWidth="1" />
  </svg>
);

const FootballIcon = ({ size = 48 }) => (
  <svg className="ap-ball" width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="20" fill="white" stroke="#4ade80" strokeWidth="1" />
    <polygon points="22,9 26.5,17 35,17 29,23 31,31 22,27 13,31 15,23 9,17 17.5,17" fill="#111827" />
  </svg>
);

const PersonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#4ade80" strokeWidth="1.2" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const BackArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ════════════════════════════════════════════════
   AllPlayers component
═══════════════════════════════════════════════ */
const AllPlayers = () => {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`
        );
        const soccerPlayers = data.player?.filter((p) => p.strSport === "Soccer") ?? [];
        setAllPlayers(soccerPlayers);
      } catch (error) {
        console.error(error);
        setAllPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [playerName]);

  /* Card animation variants */
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <>
      <style>{styles}</style>

      <div className="ap-wrap">
        <PitchSVG />
        <div className="ap-glow" />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="ap-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <FootballIcon />
              <span className="ap-loading-text">Chargement…</span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <header className="ap-header">
                <button className="ap-back" onClick={() => navigate(-1)}>
                  <BackArrow />
                  Retour
                </button>

                <div className="ap-title-block">
                  <p className="ap-eyebrow">Résultats de recherche</p>
                  <h1 className="ap-title">
                    <span className="ap-title-accent">{playerName}</span>
                  </h1>
                  <p className="ap-count">
                    {allPlayers.length} joueur{allPlayers.length !== 1 ? "s" : ""} trouvé{allPlayers.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </header>

              <div className="ap-divider" />

              {/* Grid or empty state */}
              {allPlayers.length === 0 ? (
                <div className="ap-empty">
                  <FootballIcon size={56} />
                  <p className="ap-empty-title">Aucun résultat</p>
                  <p className="ap-empty-sub">
                    Aucun joueur de football trouvé pour « {playerName} »
                  </p>
                </div>
              ) : (
                <motion.div
                  className="ap-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {allPlayers.map((player, index) => (
                    <motion.div
                      key={player.idPlayer}
                      className="ap-card"
                      variants={cardVariants}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Image zone */}
                      <div className="ap-img-wrap">
                        <span className="ap-num">#{index + 1}</span>
                        {player.strThumb ? (
                          <img
                            className="ap-img"
                            src={player.strThumb}
                            alt={player.strPlayer}
                            loading="lazy"
                          />
                        ) : (
                          <div className="ap-no-img">
                            <div className="ap-no-img-icon">
                              <PersonIcon />
                            </div>
                            <span className="ap-no-img-text">Pas d'image</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="ap-card-body">
                        <h2 className="ap-player-name">{player.strPlayer}</h2>
                         <p className="ap-team">Né le : </p> <h1> {player.dateBorn} </h1>
                        {player.strTeam && (
                          <p className="ap-team">
                            <span className="ap-team-dot" />
                            {player.strTeam}
                          </p>
                        )}
                        {player.strNationality && (
                          <p className="ap-nationality">{player.strNationality}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AllPlayers;
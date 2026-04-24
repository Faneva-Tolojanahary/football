import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Inline styles (no external CSS file needed) ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .fp-wrap {
    min-height: 100vh;
    background: #0a1a0f;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Pitch line background ── */
  .fp-pitch {
    position: absolute;
    inset: 0;
    opacity: 0.06;
    pointer-events: none;
  }

  /* ── Radial glow ── */
  .fp-glow {
    position: absolute;
    width: 640px;
    height: 640px;
    border-radius: 50%;
    background: radial-gradient(circle, #22c55e28 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* ── Content card ── */
  .fp-content {
    position: relative;
    z-index: 2;
    text-align: center;
    width: 100%;
    max-width: 500px;
  }

  /* ── Live badge ── */
  .fp-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #22c55e14;
    border: 0.5px solid #22c55e40;
    border-radius: 100px;
    padding: 5px 16px;
    margin-bottom: 1.75rem;
  }

  .fp-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: fp-pulse 2s ease-in-out infinite;
  }

  @keyframes fp-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }

  .fp-badge-text {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #4ade80;
  }

  /* ── Title ── */
  .fp-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 10vw, 80px);
    line-height: 0.92;
    color: #f0fdf4;
    letter-spacing: 0.02em;
    margin: 0 0 0.6rem;
  }

  .fp-title-accent { color: #4ade80; }

  .fp-subtitle {
    font-size: 14px;
    font-weight: 300;
    color: #4b5563;
    margin: 0 0 2.25rem;
    letter-spacing: 0.01em;
  }

  /* ── Search bar ── */
  .fp-form {
    display: flex;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #22c55e28;
    background: #ffffff08;
    transition: border-color 0.25s, box-shadow 0.25s;
  }

  .fp-form:focus-within {
    border-color: #22c55e70;
    box-shadow: 0 0 0 3px #22c55e16;
  }

  .fp-icon {
    display: flex;
    align-items: center;
    padding: 0 10px 0 16px;
    color: #374151;
    flex-shrink: 0;
  }

  .fp-input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    padding: 15px 8px;
    font-size: 15px;
    color: #f0fdf4;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    caret-color: #4ade80;
  }

  .fp-input::placeholder { color: #374151; }

  .fp-btn {
    background: #16a34a;
    border: none;
    padding: 13px 22px;
    cursor: pointer;
    color: #fff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    transition: background 0.2s, transform 0.1s;
    flex-shrink: 0;
  }

  .fp-btn:hover:not(:disabled) { background: #15803d; }
  .fp-btn:active:not(:disabled) { transform: scale(0.97); }
  .fp-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .fp-btn-arrow { transition: transform 0.2s; }
  .fp-btn:hover:not(:disabled) .fp-btn-arrow { transform: translateX(3px); }

  /* ── Quick-pick pills ── */
  .fp-hints {
    margin-top: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .fp-hint-label {
    font-size: 12px;
    color: #374151;
    margin-right: 2px;
  }

  .fp-pill {
    background: #ffffff06;
    border: 0.5px solid #ffffff10;
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 12px;
    color: #4b5563;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
  }

  .fp-pill:hover {
    background: #22c55e18;
    color: #4ade80;
    border-color: #22c55e36;
  }

  /* ── Error message ── */
  .fp-error {
    margin-top: 1rem;
    font-size: 13px;
    color: #f87171;
    font-weight: 400;
    min-height: 20px;
    transition: opacity 0.2s;
  }

  /* ── Loading overlay ── */
  .fp-loading {
    position: fixed;
    inset: 0;
    background: #0a1a0fdd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    gap: 18px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .fp-loading.fp-loading-active {
    opacity: 1;
    pointer-events: all;
  }

  .fp-ball {
    width: 44px;
    height: 44px;
    animation: fp-bounce 0.55s ease-in-out infinite alternate;
  }

  @keyframes fp-bounce {
    from { transform: translateY(-10px); }
    to   { transform: translateY(10px); }
  }

  .fp-loading-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 0.12em;
    color: #4ade80;
  }
`;

/* ─── SVG assets ─── */
const PitchSVG = () => (
  <svg className="fp-pitch" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
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

const FootballIcon = () => (
  <svg className="fp-ball" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="20" fill="white" stroke="#4ade80" strokeWidth="1" />
    <polygon
      points="22,9 26.5,17 35,17 29,23 31,31 22,27 13,31 15,23 9,17 17.5,17"
      fill="#111827"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="#4b5563" strokeWidth="1.5" />
    <path d="M10 10.5L14 14.5" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="fp-btn-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Quick-pick suggestions ─── */
const SUGGESTIONS = ["Mbappe", "Ronaldo", "Messi", "Pogba", "Benzema"];

/* ════════════════════════════════════════════════
   App component
═══════════════════════════════════════════════ */
const App = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${query}`
      );

      const soccerPlayers = data.player?.filter(
        (p) => p.strSport === "Soccer"
      );

      setTimeout(() => {
        setLoading(false);
        if (soccerPlayers && soccerPlayers.length > 0) {
          navigate(`/${query}`);
        } else {
          setError(`Aucun joueur de football trouvé pour « ${query} ».`);
        }
      }, 1800);
    } catch {
      setLoading(false);
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const fillSuggestion = (name) => {
    setSearch(name);
    setError("");
  };

  return (
    <>
      {/* Inject styles once */}
      <style>{styles}</style>

      <div className="fp-wrap">
        <PitchSVG />
        <div className="fp-glow" />

        <div className="fp-content">
         

          {/* Title */}
          <h1 className="fp-title">
            Trouve<br />ton{" "}
            <span className="fp-title-accent">joueur</span>
          </h1>
          <p className="fp-subtitle">
            Recherche parmi des milliers de footballeurs
          </p>

          {/* Search form */}
          <form className="fp-form" onSubmit={handleSubmit}>
            <div className="fp-icon">
              <SearchIcon />
            </div>
            <input
              className="fp-input"
              type="text"
              placeholder="Mbappe, Benzema, Zidane…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setError("");
              }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button className="fp-btn" type="submit" disabled={loading}>
              Rechercher
              <ArrowIcon />
            </button>
          </form>

          {/* Suggestion pills */}
          <div className="fp-hints">
            <span className="fp-hint-label">Essayer :</span>
            {SUGGESTIONS.map((name) => (
              <button
                key={name}
                className="fp-pill"
                type="button"
                onClick={() => fillSuggestion(name)}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Error feedback */}
          <p className="fp-error">{error}</p>
        </div>

        {/* Loading overlay */}
        <div className={`fp-loading ${loading ? "fp-loading-active" : ""}`}>
          <FootballIcon />
          <span className="fp-loading-text">Recherche en cours…</span>
        </div>
      </div>
    </>
  );
};

export default App;
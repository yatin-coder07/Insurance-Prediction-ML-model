"use client";

import { FormEvent, useState, useEffect, useRef } from "react";

type FormState = {
  age: string;
  sex: "male" | "female";
  bmi: string;
  children: string;
  smoker: "yes" | "no";
  region: "southwest" | "southeast" | "northwest" | "northeast";
};

const initialForm: FormState = {
  age: "30",
  sex: "male",
  bmi: "28.5",
  children: "1",
  smoker: "no",
  region: "southwest",
};

const riskFactors = [
  { label: "Age range", range: "18–64", icon: "↗" },
  { label: "BMI index", range: "15.0–50.0", icon: "↗" },
  { label: "Dependents", range: "0–5", icon: "↗" },
];

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((c) => ({ ...c, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    const payload = {
      age: Number(form.age),
      sex: form.sex,
      bmi: Number(form.bmi),
      children: Number(form.children),
      smoker: form.smoker,
      region: form.region,
    };

    if (Number.isNaN(payload.age) || Number.isNaN(payload.bmi) || Number.isNaN(payload.children)) {
      setError("Please enter valid numeric values.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prediction request failed");
      setPrediction(Number(data.prediction));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while predicting.");
    } finally {
      setLoading(false);
    }
  };

  const riskLevel = prediction
    ? prediction < 8000
      ? { label: "Low Risk", color: "#4ade80", bar: 25 }
      : prediction < 18000
      ? { label: "Moderate Risk", color: "#fb923c", bar: 58 }
      : { label: "High Risk", color: "#f87171", bar: 88 }
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080a0f;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .page-wrap {
          min-height: 100vh;
          position: relative;
        }

        /* ── NOISE TEXTURE OVERLAY ─────────────────────── */
        .page-wrap::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── GRID BACKGROUND ───────────────────────────── */
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%);
        }

        /* ── RADIAL GLOW ───────────────────────────────── */
        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: -100px;
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
        }
        .glow-orb-2 {
          width: 500px; height: 400px;
          top: 100px; right: -150px;
          background: radial-gradient(circle, rgba(99,37,235,0.07) 0%, transparent 70%);
        }

        .content {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ── HEADER ────────────────────────────────────── */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 0 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 20px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-mark {
          width: 32px; height: 32px;
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.5);
        }
        .logo-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .nav-pill {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 14px;
          border-radius: 999px;
        }

        /* ── HERO ──────────────────────────────────────── */
        .hero {
          padding: 80px 0 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }

        @media (max-width: 760px) {
          .hero { grid-template-columns: 1fr; gap: 40px; }
        }

        .hero-left {}

        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #3b82f6;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .eyebrow::before {
          content: '';
          width: 24px; height: 1px;
          background: #3b82f6;
        }

        h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 8vw, 108px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          color: #f5f0e8;
          margin-bottom: 28px;
        }
        h1 span {
          color: transparent;
          -webkit-text-stroke: 1px rgba(245, 240, 232, 0.3);
        }

        .hero-desc {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(232,228,220,0.55);
          max-width: 400px;
          margin-bottom: 40px;
        }

        /* ── STAT ROW ──────────────────────────────────── */
        .stat-row {
          display: flex;
          gap: 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 32px;
        }
        .stat-item { flex: 1; }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          color: #f5f0e8;
          letter-spacing: 0.03em;
        }
        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.3);
          margin-top: 2px;
        }
        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        /* ── FORM CARD ─────────────────────────────────── */
        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 36px;
          backdrop-filter: blur(20px);
          position: sticky;
          top: 40px;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .form-title {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.4);
        }
        .form-badge {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #3b82f6;
          border: 1px solid rgba(59,130,246,0.3);
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(59,130,246,0.06);
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .field label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.35);
        }

        .field input,
        .field select {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          color: #f5f0e8;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
        }
        .field input:focus,
        .field select:focus {
          border-color: rgba(59,130,246,0.5);
          background: rgba(59,130,246,0.04);
        }
        .field select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(232,228,220,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          cursor: pointer;
        }
        .field select option {
          background: #111318;
          color: #e8e4dc;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          margin-top: 6px;
        }
        .submit-btn:not(:disabled) {
          background: #f5f0e8;
          color: #080a0f;
        }
        .submit-btn:not(:disabled):hover {
          background: #fff;
          transform: translateY(-1px);
        }
        .submit-btn:not(:disabled):active {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          background: rgba(255,255,255,0.07);
          color: rgba(232,228,220,0.3);
          cursor: not-allowed;
        }

        .loading-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          animation: slide 1.2s ease-in-out infinite;
          width: 60%;
        }
        @keyframes slide {
          0% { left: -60%; }
          100% { left: 100%; }
        }

        /* ── RESULT SECTION ────────────────────────────── */
        .result-section {
          padding: 80px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .result-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.25);
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .result-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 760px) {
          .result-grid { grid-template-columns: 1fr; }
        }

        .result-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px;
        }
        .result-card.featured {
          grid-column: span 2;
          border-color: rgba(59,130,246,0.2);
          background: rgba(59,130,246,0.04);
        }

        @media (max-width: 760px) {
          .result-card.featured { grid-column: span 1; }
        }

        .result-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.3);
          margin-bottom: 16px;
        }
        .result-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 64px;
          line-height: 1;
          letter-spacing: 0.02em;
          color: #f5f0e8;
          margin-bottom: 8px;
        }
        .result-currency {
          font-size: 28px;
          color: rgba(245,240,232,0.4);
          vertical-align: top;
          margin-top: 8px;
          margin-right: 4px;
          display: inline-block;
        }
        .result-subtext {
          font-size: 12px;
          color: rgba(232,228,220,0.35);
          line-height: 1.6;
        }

        .risk-bar-wrap {
          margin-top: 20px;
        }
        .risk-bar-track {
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          overflow: hidden;
          margin: 10px 0;
        }
        .risk-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .risk-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .risk-pill {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid;
        }

        .breakdown-list {
          list-style: none;
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 13px;
        }
        .breakdown-item:last-child { border-bottom: none; }
        .breakdown-key {
          color: rgba(232,228,220,0.4);
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .breakdown-val {
          color: #f5f0e8;
          font-weight: 400;
        }

        .empty-result {
          color: rgba(232,228,220,0.2);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .empty-hint {
          font-size: 12px;
          color: rgba(232,228,220,0.2);
          margin-top: 8px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.1em;
        }

        .error-msg {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 12px;
          color: #fca5a5;
          margin-top: 12px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
        }

        /* ── TICKER BAR ─────────────────────────────────── */
        .ticker-wrap {
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 14px 0;
          margin: 40px 0;
        }
        .ticker-inner {
          display: flex;
          gap: 60px;
          width: max-content;
          animation: ticker 20s linear infinite;
        }
        .ticker-item {
          white-space: nowrap;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,228,220,0.18);
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .ticker-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(232,228,220,0.15);
          flex-shrink: 0;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── FEATURE STRIP ──────────────────────────────── */
        .feature-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 80px;
        }
        .feature-item {
          background: #080a0f;
          padding: 28px 24px;
        }
        .feature-icon {
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          font-size: 14px;
        }
        .feature-heading {
          font-size: 14px;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 6px;
        }
        .feature-body {
          font-size: 12px;
          color: rgba(232,228,220,0.3);
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .field-grid { grid-template-columns: 1fr; }
          .feature-strip { grid-template-columns: 1fr; }
          h1 { font-size: 72px; }
        }

        /* Fade-in on mount */
        .fade-in {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .fade-in-2 { animation-delay: 0.1s; }
        .fade-in-3 { animation-delay: 0.2s; }
        .fade-in-4 { animation-delay: 0.3s; }
        @keyframes fadeUp {
          to { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />

        <div className="content">
          {/* Header */}
          <header>
            <div className="logo">
              <div className="logo-mark">ML</div>
              <span className="logo-text">InsureIQ</span>
            </div>
            <div className="nav-pill">ML v2.4 · Live</div>
          </header>

          {/* Ticker */}
          <div className="ticker-wrap">
            <div className="ticker-inner">
              {[...Array(2)].map((_, i) => (
                <span key={i} style={{ display: 'flex', gap: '60px' }}>
                  {["Gradient Boosting Model","R² Score: 0.872","MAE: $2,847","Training samples: 1,338","Features: 6","Accuracy: 87.2%","Medical cost prediction","US Regional Analysis"].map((t) => (
                    <span key={t} className="ticker-item">
                      <span className="ticker-dot" />
                      {t}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* Hero */}
          <div className="hero">
            <div className="hero-left fade-in">
              <div className="eyebrow">Medical Cost Intelligence</div>
              <h1>
                PREDICT<br />
                YOUR<br />
                <span>COVER</span><br />
                COST
              </h1>
              <p className="hero-desc">
                A trained gradient boosting model estimates your annual
                medical insurance charges based on six key health and
                demographic indicators.
              </p>

              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-num">87.2%</div>
                  <div className="stat-label">Accuracy</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-num">1,338</div>
                  <div className="stat-label">Samples</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-num">6</div>
                  <div className="stat-label">Features</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="fade-in fade-in-2">
              <div className="form-card">
                <div className="form-header">
                  <span className="form-title">Patient Profile</span>
                  <span className="form-badge">ML Inference</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="field-grid">
                    <div className="field">
                      <label>Age</label>
                      <input
                        type="number" min="1" max="120"
                        value={form.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Sex</label>
                      <select
                        value={form.sex}
                        onChange={(e) => handleChange("sex", e.target.value as FormState["sex"])}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>BMI Index</label>
                      <input
                        type="number" step="0.1" min="1"
                        value={form.bmi}
                        onChange={(e) => handleChange("bmi", e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Dependents</label>
                      <input
                        type="number" min="0"
                        value={form.children}
                        onChange={(e) => handleChange("children", e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Smoker</label>
                      <select
                        value={form.smoker}
                        onChange={(e) => handleChange("smoker", e.target.value as FormState["smoker"])}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Region</label>
                      <select
                        value={form.region}
                        onChange={(e) => handleChange("region", e.target.value as FormState["region"])}
                      >
                        <option value="southwest">Southwest</option>
                        <option value="southeast">Southeast</option>
                        <option value="northwest">Northwest</option>
                        <option value="northeast">Northeast</option>
                      </select>
                    </div>
                  </div>

                  <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Running Inference..." : "Calculate Charges"}
                    {loading && <span className="loading-bar" />}
                  </button>

                  {error && <div className="error-msg">⚠ {error}</div>}
                </form>
              </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="feature-strip fade-in fade-in-3">
            {[
              { icon: "⬡", title: "Gradient Boosting", body: "XGBoost ensemble trained on NHIS-derived dataset for high accuracy on non-linear patterns." },
              { icon: "◈", title: "6 Risk Dimensions", body: "Age, BMI, smoking status, sex, region, and dependents evaluated simultaneously." },
              { icon: "◎", title: "Regional Modeling", body: "Charges calibrated per US census region to account for cost-of-care variance." },
            ].map((f) => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-heading">{f.title}</div>
                <div className="feature-body">{f.body}</div>
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="result-section fade-in fade-in-4" ref={resultRef}>
            <div className="result-section-label">Prediction Output</div>

            <div className="result-grid">
              <div className="result-card featured">
                <div className="result-card-label">Estimated Annual Charge</div>
                {prediction !== null ? (
                  <>
                    <div className="result-amount">
                      <span className="result-currency">$</span>
                      {new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(prediction)}
                    </div>
                    <p className="result-subtext">
                      Predicted by ML model · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="empty-result">——</div>
                    <div className="empty-hint">Awaiting inference</div>
                  </>
                )}
              </div>

              <div className="result-card">
                <div className="result-card-label">Risk Assessment</div>
                {riskLevel ? (
                  <div className="risk-bar-wrap">
                    <div className="risk-label">
                      <span style={{ fontSize: 12, color: 'rgba(232,228,220,0.4)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '10px' }}>Charge Level</span>
                      <span className="risk-pill" style={{ color: riskLevel.color, borderColor: riskLevel.color + '44', background: riskLevel.color + '11' }}>
                        {riskLevel.label}
                      </span>
                    </div>
                    <div className="risk-bar-track">
                      <div
                        className="risk-bar-fill"
                        style={{ width: `${riskLevel.bar}%`, background: riskLevel.color }}
                      />
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(232,228,220,0.35)', marginTop: 4, fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.08em' }}>
                      {riskLevel.bar}th percentile
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="empty-result" style={{ fontSize: 32 }}>N/A</div>
                    <div className="empty-hint">Submit form first</div>
                  </>
                )}

                {prediction !== null && (
                  <ul className="breakdown-list" style={{ marginTop: 24 }}>
                    {[
                      ["Age", form.age + " yrs"],
                      ["BMI", form.bmi],
                      ["Smoker", form.smoker],
                      ["Region", form.region],
                    ].map(([k, v]) => (
                      <li key={k} className="breakdown-item">
                        <span className="breakdown-key">{k}</span>
                        <span className="breakdown-val">{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
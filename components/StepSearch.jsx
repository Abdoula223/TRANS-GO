import { CITIES, addDays, fmtDate } from "../lib/data";

const POPULAR = ["Sikasso", "Ségou", "Mopti", "Kayes", "Koutiala"];

export default function StepSearch({ b, set, say }) {
  const saturday = addDays((6 - new Date().getDay() + 7) % 7 || 7);
  const search = () => {
    if (b.from === b.to) return say("Départ et arrivée doivent être différents");
    set({ filter: "all", step: 2 });
  };
  const Select = ({ value, field }) => (
    <select value={value} onChange={(e) => set({ [field]: e.target.value })}>
      {CITIES.map((c) => <option key={c}>{c}</option>)}
    </select>
  );
  return (
    <>
      <div className="badges"><span className="bd">🛡 Réservation 100% officielle</span><span className="bd o">⚡ Mode Express OTP</span></div>
      <h1>Votre billet de bus <em>en 3 clics</em></h1>
      <p className="mu" style={{ fontSize: 15 }}>Comparez et réservez instantanément les meilleures compagnies au Mali et en Afrique de l’Ouest.</p>
      <div className="card">
        <div className="up">◉ Ville de départ</div>
        <div className="fld">🏢<Select value={b.from} field="from" /></div>
        <button className="sw" onClick={() => set({ from: b.to, to: b.from })}>⇅</button>
        <div className="up">📍 Ville d’arrivée</div>
        <div className="fld">🚩<Select value={b.to} field="to" /></div>
        <div className="up">Destinations populaires :</div>
        <div className="chips">{POPULAR.map((c) => <button key={c} className={"ch" + (b.to === c ? " on" : "")} onClick={() => set({ to: c })}>{c}</button>)}</div>
        <div className="up">📅 Date de départ</div>
        <div className="fld"><input type="date" min={addDays(0)} value={b.date} onChange={(e) => e.target.value && set({ date: e.target.value })} /></div>
        <div className="mu" style={{ margin: "-6px 0 8px" }}>{fmtDate(b.date, true)} · Places disponibles</div>
        <div className="row">
          {[["Aujourd’hui", addDays(0)], ["Demain", addDays(1)], ["Ce week-end", saturday]].map(([l, d]) => (
            <button key={l} className={"ch g" + (b.date === d ? " on" : "")} onClick={() => set({ date: d })}>{l}</button>
          ))}
        </div>
        <div className="up" style={{ marginTop: 12 }}>👥 Nombre de passagers</div>
        <div className="fld">
          <span style={{ flex: 1, fontWeight: 600 }}>{b.passengers} passager{b.passengers > 1 ? "s" : ""} (Adulte)</span>
          <div className="step">
            <button onClick={() => set({ passengers: Math.max(1, b.passengers - 1) })}>−</button>
            <b>{b.passengers}</b>
            <button className="p" onClick={() => set({ passengers: Math.min(6, b.passengers + 1) })}>+</button>
          </div>
        </div>
        <button className="cta" onClick={search}>🔍 Rechercher les départs →</button>
      </div>
      <div className="promo"><span className="up" style={{ color: "#fff" }}>★ Ligne VIP quotidienne</span><b>Bamako → Sikasso sans arrêt</b><span style={{ fontSize: 13 }}>Climatisation, WiFi à bord et collation offerte dès 7 500 FCFA</span></div>
      <div className="g2"><div><b>Remboursement</b>Annulation sans frais jusqu’à 2h avant le départ</div><div><b>Billet immédiat</b>QR Code direct sur WhatsApp et par SMS</div></div>
      <div className="up" style={{ margin: "6px 0" }}>Compagnies partenaires officielles</div>
      <div className="cp"><span>🚌 Bani Transport</span><span>🚌 SONEF Express</span><span>🚌 TSR</span></div>
      <div className="card" style={{ marginTop: 12 }}>
        <b>Paiement Mobile Money sécurisé</b>
        <p className="mu">Réglez en FCFA sans carte bancaire avec votre solde habituel :</p>
        <div className="cp"><span style={{ color: "var(--pr)" }}>● Wave</span><span style={{ color: "var(--or)" }}>● Orange Money</span><span style={{ color: "#0058a8" }}>● Moov Money</span></div>
      </div>
      <div className="nav"><div>
        <button className="on"><span>🧭</span>Recherche</button>
        <button onClick={() => (b.ticketRef ? set({ step: 5 }) : say("Aucun billet pour l’instant"))}><span>🎫</span>Mes billets</button>
        <button onClick={() => say("Bientôt disponible")}><span>🕘</span>Trajets</button>
        <button onClick={() => say("Bientôt disponible")}><span>👤</span>Profil</button>
      </div></div>
    </>
  );
}

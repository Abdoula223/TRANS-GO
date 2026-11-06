import { getTrips, fmtDate, fmtPrice, station } from "../lib/data";

const FILTERS = (n) => [["all", `Tous les départs (${n})`], ["am", "Matin (06h - 12h)"], ["pm", "Après-midi"], ["ac", "Climatisé"]];

export default function StepTripSelection({ b, set, back }) {
  const all = getTrips(b.from, b.to);
  const list = all.filter((t) => b.filter === "all" || (b.filter === "am" && t.departureTime < "12:00") || (b.filter === "pm" && t.departureTime >= "12:00") || (b.filter === "ac" && t.ac));
  return (
    <>
      <div className="sum">
        <div className="r"><span className="up" style={{ color: "var(--pr)" }}>Étape 2 sur 5</span><span className="pill">● {list.length} départs trouvés</span></div>
        <h2 style={{ fontSize: 22, margin: "8px 0 2px" }}>{b.from} → {b.to}</h2>
        <div className="r"><span className="mu">📅 {fmtDate(b.date, true)} · {b.passengers} passager{b.passengers > 1 ? "s" : ""}</span><button className="pill" onClick={back}>Modifier</button></div>
      </div>
      <div className="chips">{FILTERS(all.length).map(([k, l]) => <button key={k} className={"ch" + (b.filter === k ? " on" : "")} onClick={() => set({ filter: k })}>{l}</button>)}</div>
      {list.length === 0 && <div className="card mu">Aucun départ pour ce filtre.</div>}
      {list.map((t) => {
        const full = t.freeSeats < b.passengers;
        const cls = t.freeSeats <= 2 ? "d" : t.freeSeats <= 5 ? "w" : "ok";
        const msg = t.freeSeats <= 2 ? `⏰ Seulement ${t.freeSeats} places restantes` : t.freeSeats <= 5 ? `Plus que ${t.freeSeats} places !` : `● ${t.freeSeats} places disponibles`;
        return (
          <div className="card tc" key={t.id}>
            <div className="h">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}><div className="lo">{t.initials}</div><div><b style={{ fontSize: 18 }}>{t.company}</b><div className="mu">{t.busType}</div></div></div>
              <span className="pill" style={{ maxWidth: 120, whiteSpace: "normal", textAlign: "center" }}>{t.badge}</span>
            </div>
            <div className="tl">
              <div><b>{t.departureTime}</b><span className="mu">{station(b.from)}</span></div>
              <div>{t.duration}<br />🚌 Direct</div>
              <div><b>{t.arrivalTime}</b><span className="mu">{station(b.to)}</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span className={"st " + cls}>{msg}</span><span>{t.amenities}</span></div>
            <div className="row" style={{ alignItems: "flex-end", marginTop: 12 }}>
              <div><div className="mu">Tarif par passager</div><div className="pr">{t.price.toLocaleString("fr-FR")} <small>FCFA</small></div></div>
              <button className={"cta" + (t.ac ? "" : " or")} style={{ margin: 0, flex: 1.3 }} disabled={full} onClick={() => set({ trip: t, seats: [], step: 3 })}>
                {full ? `Complet pour ${b.passengers}` : "Choisir ce départ ›"}
              </button>
            </div>
          </div>
        );
      })}
      <div className="card" style={{ textAlign: "center", background: "var(--pr2)" }}>
        <b style={{ color: "var(--pr)" }}>🛡 Garantie voyage TransGo</b>
        <p className="mu" style={{ margin: "6px 0 0" }}>Pas de frais cachés · Billet garanti immédiatement par SMS et WhatsApp</p>
      </div>
    </>
  );
}

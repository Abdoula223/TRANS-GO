import { useEffect, useState } from "react";
import { occupiedSeats, seatKind, seatRow, fmtPrice } from "../lib/data";

const BACK_ROW = ["41", "42", "43", "44", "45", "46"];

export default function StepSeatPicker({ b, set, say, back }) {
  const { trip, seats, passengers } = b;
  const taken = occupiedSeats(trip, b.date);
  const [left, setLeft] = useState(300);
  const locked = seats.length > 0;

  // Blocage temporaire des sièges : 5 minutes dès le premier choix
  useEffect(() => {
    if (!locked) return;
    const tick = () => {
      const r = Math.max(0, Math.round((b.lockEnd - Date.now()) / 1000));
      setLeft(r);
      if (!r) { set({ seats: [] }); say("⏱ Délai expiré : sièges libérés"); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [locked, b.lockEnd]);

  const toggle = (id) => {
    if (seats.includes(id)) return set({ seats: seats.filter((s) => s !== id) });
    if (seats.length >= passengers) return say(`Vous avez choisi ${passengers} siège(s) pour ${passengers} passager(s)`);
    const next = [...seats, id].sort((x, y) => x - y);
    set({ seats: next, ...(locked ? {} : { lockEnd: Date.now() + 300000 }) });
  };
  const Seat = ({ id }) => {
    const x = taken.includes(id), i = seats.indexOf(id);
    return (
      <button className={"s" + (x ? " t" : "") + (i > -1 ? " sel" : "")} disabled={x} onClick={() => toggle(id)}>
        {i > -1 && <u>{passengers > 1 ? `P${i + 1}` : "MOI"}</u>}{id}<i>{i > -1 ? "✓" : ""}</i>
      </button>
    );
  };
  const ready = seats.length === passengers;
  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  return (
    <>
      <div className="sum">
        <div className="r"><b style={{ fontSize: 18 }}>{trip.company}</b><span className="pill" style={{ background: "var(--or2)", color: "var(--or)" }}>{trip.departureTime}</span></div>
        <div className="r mu"><span>{b.from} → {b.to}</span><b style={{ color: "var(--tx)", fontSize: 16 }}>{fmtPrice(trip.price)}/siège</b></div>
        <div className="mu" style={{ borderTop: "1px solid var(--bd)", marginTop: 8, paddingTop: 8 }}>{trip.ac ? "❄ Climatisé · 📶 WiFi · " : "🌬 Ventilé · "}🧳 2 valises incluses</div>
      </div>
      {locked
        ? <div className="tm">⏱ <b style={{ textDecoration: "none" }}>Places réservées temporairement</b><br />Expire dans <b>{mm}</b> minutes</div>
        : <div className="inf" style={{ marginBottom: 12 }}>Choisissez {passengers} siège{passengers > 1 ? "s" : ""} : places bloquées 5 minutes dès le premier choix.</div>}
      <div className="lg2"><span>▢ Libre</span><span style={{ color: "var(--btn)" }}>◼ Choisi</span><span style={{ color: "#9a9a9a" }}>◼ Occupé</span></div>
      <div className="card">
        <div className="dr">
          <div><span className="pill">ENTRÉE</span> <span className="mu">Avant du bus</span></div>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: "var(--mu)" }}><circle cx="20" cy="20" r="16" /><circle cx="20" cy="20" r="4" /><path d="M4 20h12M24 20h12M20 24v12" /></svg>
        </div>
        <div className="bus">
          {Array.from({ length: 8 }, (_, r) => {
            const n = r * 5;
            return [n + 1, n + 2, "gap", n + 3, n + 4, n + 5].map((v) => v === "gap" ? <span key={`g${r}`} /> : <Seat key={v} id={String(v)} />);
          })}
          {BACK_ROW.map((id) => <Seat key={id} id={id} />)}
        </div>
        <div className="inf" style={{ marginTop: 12, textAlign: "center", fontSize: 11, fontWeight: 700 }}>ARRIÈRE DU BUS{trip.ac ? " · CLIMATISATION RENFORCÉE" : ""}</div>
      </div>
      <div className="fb"><div>
        <div className="r">
          <div className="n">{seats.length}</div>
          <div>
            <b>{seats.length ? `Siège${seats.length > 1 ? "s" : ""} ${seats.map((s) => s + (seats.length === 1 ? ` (${seatKind(s)})` : "")).join(", ")}` : "Aucun siège"}</b>
            <div className="mu">{seats.length ? `Rangée ${seatRow(seats[0])}` : "Choisissez vos places"}</div>
          </div>
          <div style={{ textAlign: "right" }}><div className="up">Total net</div><b style={{ fontSize: 20 }}>{fmtPrice(seats.length * trip.price)}</b></div>
        </div>
        <button className="cta or" disabled={!ready} onClick={() => set({ step: 4, pax: seats.map((_, i) => b.pax[i] || { name: "", phone: "", idNumber: "" }) })}>
          {ready ? "Continuer vers le paiement ›" : `Encore ${passengers - seats.length} siège(s) à choisir`}
        </button>
      </div></div>
    </>
  );
}

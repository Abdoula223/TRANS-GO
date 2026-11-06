import { QRCodeSVG } from "qrcode.react";
import { CODE, PAYMENT_METHODS, fmtDate, fmtPrice, seatKind, seatRow, station } from "../lib/data";

export default function StepTicket({ b, say, reset }) {
  const { trip, seats, pax, ticketRef } = b;
  const method = PAYMENT_METHODS[b.payMethod];
  return (
    <>
      <svg className="ok" width="84" height="84" viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" /><path d="M24 41l12 12 21-24" /></svg>
      <h1 style={{ textAlign: "center", fontSize: 26 }}>Paiement confirmé !</h1>
      <p className="mu" style={{ textAlign: "center", fontSize: 15 }}>Votre réservation est validée et garantie. Bon voyage !</p>
      {seats.map((s, i) => (
        <div className="card tk" key={s}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
            <div><b style={{ color: "var(--pr)" }}>BILLET ÉLECTRONIQUE OFFICIEL</b><div className="mu">TransGo Express</div></div>
            <span className="pill" style={{ background: "var(--bl)", color: "var(--tx)" }}>REF : {ticketRef}</span>
          </div>
          <div className="tl">
            <div><b style={{ fontSize: 26 }}>{CODE[b.from]}</b><span className="mu">{b.from}<br />{station(b.from)}</span></div>
            <div>{trip.duration}<br />Direct</div>
            <div><b style={{ fontSize: 26 }}>{CODE[b.to]}</b><span className="mu">{b.to}<br />{station(b.to)}</span></div>
          </div>
          <div className="mu" style={{ margin: "-4px 0 8px" }}>📅 {fmtDate(b.date)} · 🕐 {trip.departureTime} → {trip.arrivalTime}</div>
          <div className="g">
            <div><span className="mu">Passager</span><b>{pax[i].name}</b>Tarif adulte</div>
            <div className="or"><span className="mu">Siège attribué</span><b>{s} <small>({seatKind(s)}, R{seatRow(s)})</small></b>{trip.ac ? "Bus climatisé" : "Bus ventilé"}</div>
            <div><span className="mu">Compagnie</span><b>{trip.company}</b>{trip.busType}</div>
            <div className="gr"><span className="mu">Montant réglé</span><b>{fmtPrice(trip.price)}</b>{method.full} #{b.opRef}</div>
          </div>
          <div className="ds" />
          <div style={{ textAlign: "center" }}>
            <div className="up" style={{ color: "var(--pr)", marginBottom: 8 }}>Pass d’embarquement numérique</div>
            <div className="qr"><QRCodeSVG size={140} value={JSON.stringify({ ticketRef, passenger: pax[i].name, seat: s, status: "CONFIRMED" })} /></div>
            <p style={{ margin: "8px 0 0" }}>Présentez ce QR code au contrôleur à la montée du bus</p>
            <div className="mu">Luminosité maximale recommandée</div>
          </div>
        </div>
      ))}
      <div className="noprint">
        <button className="cta" onClick={() => window.print()}>⬇ Télécharger en PDF / Imprimer</button>
        <button className="cta" style={{ background: "var(--bl)", color: "var(--tx)" }} onClick={() => say(`✅ Billet envoyé au +223 ${pax[0].phone} (simulé)`)}>💬 Recevoir par WhatsApp et SMS</button>
        <button className="ch" style={{ width: "100%", marginTop: 10, background: "none", color: "var(--or)" }} onClick={reset}>🔄 Réserver un autre billet</button>
        <div className="inf" style={{ marginTop: 12 }}><b>Besoin d’aide ?</b><br />Service client TransGo disponible 24/7 (démo)</div>
      </div>
    </>
  );
}

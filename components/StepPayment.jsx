import { PAYMENT_METHODS, fmtDate, fmtPrice } from "../lib/data";

export default function StepPayment({ b, set, say }) {
  const { trip, seats, pax } = b;
  const method = PAYMENT_METHODS[b.payMethod];
  const total = seats.length * trip.price;
  const digits = (s) => s.replace(/\D/g, "").length;
  const setPax = (i, k, v) => set({ pax: pax.map((p, j) => (j === i ? { ...p, [k]: v } : p)) });

  const pay = () => {
    const ok = pax.every((p) => p.name.trim().length >= 3 && p.idNumber.trim()) && digits(pax[0].phone) >= 8 && digits(b.debitPhone) >= 8;
    if (!ok) return say("Complétez les infos passagers et le numéro Mobile Money");
    set({ paying: true });
    // Simulation : en production, appeler l'API de paiement puis attendre le webhook de confirmation
    setTimeout(() => set({
      paying: false, step: 5,
      ticketRef: "TG-2026-" + (1000 + Math.floor(Math.random() * 9000)),
      opRef: method.prefix + "-" + (100000 + Math.floor(Math.random() * 900000)),
    }), 2000);
  };

  if (b.paying) return (
    <div className="card" style={{ textAlign: "center" }}>
      <div className="spin" /><b>Confirmez sur votre téléphone</b>
      <p className="mu">Invite USSD envoyée via {method.full}. Saisissez votre code secret.</p>
    </div>
  );
  return (
    <>
      <h2><span className="pill">Étape 4/5</span> Passager et règlement</h2>
      <div className="sum"><div className="r">
        <div><b style={{ fontSize: 18 }}>{b.from} → {b.to}</b><div className="mu">{fmtDate(b.date)} · {trip.departureTime} · {trip.company}</div></div>
        <div style={{ textAlign: "right" }}><span className="up">Siège{seats.length > 1 ? "s" : ""}</span><br /><b style={{ color: "var(--or)", fontSize: 20 }}>{seats.join(", ")}</b></div>
      </div></div>
      <h2>① Informations du passager</h2>
      {seats.map((s, i) => (
        <div className="card" key={s}>
          <b>Passager {i + 1} · Siège {s}</b>
          <label>Nom et prénom complet</label>
          <div className="fld"><input value={pax[i].name} onChange={(e) => setPax(i, "name", e.target.value)} placeholder="Ex. Abdoulaye Diallo" /></div>
          {i === 0 && (<>
            <label>Téléphone (WhatsApp / SMS pour e-billet)</label>
            <div className="row"><div className="pre" style={{ flex: "0 0 auto", margin: "6px 0 12px" }}>🇲🇱 +223</div>
              <div className="fld"><input type="tel" value={pax[i].phone} onChange={(e) => setPax(i, "phone", e.target.value)} placeholder="76 12 34 56" /></div></div>
          </>)}
          <label>Pièce d’identité (CNI / NINA / Passeport)</label>
          <div className="fld"><input value={pax[i].idNumber} onChange={(e) => setPax(i, "idNumber", e.target.value)} placeholder="CNI ML-…" /></div>
          <div className="mu">Obligatoire pour les postes de contrôle de gendarmerie</div>
        </div>
      ))}
      <h2>② Paiement Mobile Money <span className="mu" style={{ marginLeft: "auto", color: "var(--pr)" }}>100% SÉCURISÉ</span></h2>
      <div className="tiles">
        {Object.entries(PAYMENT_METHODS).map(([k, m]) => (
          <button key={k} className={"tile" + (b.payMethod === k ? " on" : "")} onClick={() => set({ payMethod: k })}><b>{m.name}</b><small>{m.sub}</small><div className="rd" /></button>
        ))}
      </div>
      <div className="card">
        <label style={{ marginTop: 0 }}>Numéro {method.full} à débiter</label>
        <div className="row"><div className="pre" style={{ flex: "0 0 auto", margin: "6px 0 12px" }}>🇲🇱 +223</div>
          <div className="fld"><input type="tel" value={b.debitPhone} onChange={(e) => set({ debitPhone: e.target.value })} placeholder="76 12 34 56" /></div></div>
        <div className="inf">Une invite instantanée (USSD) va apparaître sur votre écran pour taper votre code secret et autoriser le prélèvement de {fmtPrice(total)}.</div>
      </div>
      <div className="card">
        <b style={{ fontSize: 17 }}>Récapitulatif tarifaire</b>
        <div className="sum" style={{ background: "none", padding: "8px 0 0" }}>
          <div className="r"><span>{seats.length}× Billet {b.from} → {b.to}</span><span>{fmtPrice(total)}</span></div>
          <div className="r mu"><span>Frais de service TransGo</span><span><s>{fmtPrice(350 * seats.length)}</s> <b style={{ color: "var(--pr)" }}>Offerts</b></span></div>
        </div>
        <div className="tot"><b style={{ fontSize: 17, color: "var(--tx)" }}>Total à débiter</b><b>{fmtPrice(total)}</b></div>
      </div>
      <button className="cta" style={{ background: method.color }} onClick={pay}>🔒 Payer {fmtPrice(total)} avec {method.full}</button>
      <div className="mu" style={{ marginTop: 8 }}>⚡ Validation instantanée sous 3 secondes · Reçu officiel TransGo inclus</div>
    </>
  );
}

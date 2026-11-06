"use client";
import { useState } from "react";
import { addDays } from "../lib/data";
import StepSearch from "./StepSearch";
import StepTripSelection from "./StepTripSelection";
import StepSeatPicker from "./StepSeatPicker";
import StepPayment from "./StepPayment";
import StepTicket from "./StepTicket";

const TITLES = ["", "Recherche", "Horaires et compagnies", "Sélection des sièges", "Paiement Mobile Money", "Billet QR"];
const INITIAL = {
  step: 1, // 1 Recherche · 2 Trajet · 3 Sièges · 4 Passager & paiement · 5 Billet
  from: "Bamako", to: "Sikasso", date: "", passengers: 1,
  filter: "all", trip: null, seats: [], lockEnd: 0,
  pax: [], payMethod: "ORANGE_MONEY", debitPhone: "",
  paying: false, ticketRef: "", opRef: "",
};

export default function CheckoutFlow() {
  const [b, setB] = useState(() => ({ ...INITIAL, date: addDays(1) }));
  const [toast, setToast] = useState("");
  const set = (patch) => setB((s) => ({ ...s, ...patch }));
  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const back = () => b.step > 1 && set({ step: b.step - 1, ...(b.step <= 3 ? { seats: [] } : {}) });
  const reset = () => setB({ ...INITIAL, date: addDays(1) });
  const props = { b, set, say, back, reset };

  return (
    <div className="app">
      {b.step === 1 ? (
        <div className="top">
          <div className="lg">🚌</div>
          <div className="t"><b>TransGo</b><small>VOYAGE EXPRESS</small></div>
          <div className="av">🔔</div><div className="av">👤</div>
        </div>
      ) : (
        <>
          <div className="top">
            <button className="bk" onClick={back}>←</button>
            <div className="t"><b>{TITLES[b.step]}</b><small>TRANSGO EXPRESS</small></div>
            <div className="av">👤</div>
          </div>
          <div className="prog">{[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= b.step ? "on" : ""} />)}</div>
        </>
      )}
      {b.step === 1 && <StepSearch {...props} />}
      {b.step === 2 && <StepTripSelection {...props} />}
      {b.step === 3 && <StepSeatPicker {...props} />}
      {b.step === 4 && <StepPayment {...props} />}
      {b.step === 5 && <StepTicket {...props} />}
      <div className="note noprint">Prototype de démonstration · données et paiements simulés</div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

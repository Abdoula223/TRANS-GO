// Données mockées en mémoire (aucun backend). Remplacer par l'API plus tard.
export const CITIES = ["Bamako", "Sikasso", "Ségou", "Mopti", "Kayes", "Koutiala", "Gao"];
export const CODE = { Bamako: "BKO", Sikasso: "SKO", "Ségou": "SEG", Mopti: "MPT", Kayes: "KYS", Koutiala: "KTL", Gao: "GAO" };
// Distance relative à Bamako : sert à calculer prix et durée pour n'importe quel trajet
const FACTOR = { Bamako: 0, Sikasso: 1, "Ségou": 0.8, Mopti: 1.8, Kayes: 1.6, Koutiala: 0.9, Gao: 3.6 };
export const TOTAL_SEATS = 46;

export const MOCK_TRIPS = [
  { id: "trip-1", company: "Bani Transport", initials: "BT", departureTime: "06:45", baseMinutes: 420, basePrice: 5000, busType: "Standard Confort", badge: "👍 Recommandé", freeSeats: 12, amenities: "🌬 🧳", ac: false },
  { id: "trip-2", company: "Sonef Transport", initials: "SX", departureTime: "08:00", baseMinutes: 390, basePrice: 6000, busType: "VIP Climatisé", badge: "⭐ Grand Confort VIP", freeSeats: 5, amenities: "❄ 📶 🔌", ac: true },
  { id: "trip-3", company: "TSR (Transport Socoura)", initials: "TS", departureTime: "10:30", baseMinutes: 420, basePrice: 5000, busType: "Standard", badge: "Départ milieu de matinée", freeSeats: 2, amenities: "🌬 🧳", ac: false },
];

export const PAYMENT_METHODS = {
  ORANGE_MONEY: { name: "Orange", sub: "Money", full: "Orange Money", color: "#a84300", prefix: "OM" },
  WAVE: { name: "Wave", sub: "0% frais", full: "Wave", color: "#0e7c93", prefix: "WV" },
  MOOV_MONEY: { name: "Moov", sub: "Africa", full: "Moov Money", color: "#0058a8", prefix: "MM" },
};

const p2 = (n) => String(n).padStart(2, "0");
export const fmtPrice = (n) => n.toLocaleString("fr-FR") + " FCFA";
export const isoDate = (d) => d.toISOString().slice(0, 10);
export const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };
export const fmtDate = (d, weekday) => {
  const s = new Date(d + "T12:00").toLocaleDateString("fr-FR", { weekday: weekday ? "long" : undefined, day: "numeric", month: "long", year: "numeric" });
  return s[0].toUpperCase() + s.slice(1);
};
export const station = (c) => (c === "Bamako" ? "Gare Sogoniko" : "Gare " + c);

export function getTrips(from, to) {
  const f = Math.max(0.5, Math.abs(FACTOR[from] - FACTOR[to]));
  return MOCK_TRIPS.map((t) => {
    const m = Math.max(120, Math.round((t.baseMinutes * f) / 5) * 5);
    const [h, i] = t.departureTime.split(":").map(Number);
    const a = (h * 60 + i + m) % 1440;
    return { ...t, from, to, price: Math.round((t.basePrice * f) / 500) * 500, duration: `${Math.floor(m / 60)}h ${p2(m % 60)}`, arrivalTime: `${p2(Math.floor(a / 60))}:${p2(a % 60)}` };
  });
}

// Sièges occupés : tirage déterministe, cohérent avec le nombre de places libres annoncé
export function occupiedSeats(trip, date) {
  let h = 0;
  for (const c of trip.id + date + trip.from + trip.to) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = Array.from({ length: TOTAL_SEATS }, (_, i) => String(i + 1));
  for (let i = TOTAL_SEATS - 1; i > 0; i--) { h = (h * 1664525 + 1013904223) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, TOTAL_SEATS - trip.freeSeats);
}
export const seatKind = (s) => { const n = +s; return n > 40 ? ["Fenêtre", "Couloir", "Arrière", "Couloir", "Milieu", "Fenêtre"][n - 41] : ["Fenêtre", "Couloir", "Couloir", "Milieu", "Fenêtre"][(n - 1) % 5]; };
export const seatRow = (s) => (+s > 40 ? 9 : Math.ceil(+s / 5));

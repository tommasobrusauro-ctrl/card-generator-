// CardGenerator Pro — fixed Stripe test fixtures only. No real-card generation.
const FIXTURES = [
  {brand:"Visa",short:"VISA",scenario:"Pagamento riuscito",number:"4242 4242 4242 4242",description:"Fixture standard per verificare un pagamento completato in ambiente di test.",cvc:"Qualsiasi 3 cifre",expiry:"Qualsiasi data futura"},
  {brand:"Visa",short:"VISA",scenario:"Autenticazione richiesta",number:"4000 0025 0000 3155",description:"Fixture per verificare un flusso di pagamento che richiede autenticazione 3D Secure.",cvc:"Qualsiasi 3 cifre",expiry:"Qualsiasi data futura"},
  {brand:"Visa",short:"VISA",scenario:"Pagamento rifiutato",number:"4000 0000 0000 9995",description:"Fixture per simulare un rifiuto generico della carta durante i test.",cvc:"Qualsiasi 3 cifre",expiry:"Qualsiasi data futura"},
  {brand:"Mastercard",short:"MC",scenario:"Pagamento riuscito",number:"5555 5555 5555 4444",description:"Fixture standard Mastercard per testare un pagamento completato.",cvc:"Qualsiasi 3 cifre",expiry:"Qualsiasi data futura"},
  {brand:"American Express",short:"AMEX",scenario:"Pagamento riuscito",number:"3782 822463 10005",description:"Fixture American Express per testare un pagamento completato.",cvc:"Qualsiasi 4 cifre",expiry:"Qualsiasi data futura"},
  {brand:"Discover",short:"DISC",scenario:"Pagamento riuscito",number:"6011 1111 1111 1117",description:"Fixture Discover per testare un pagamento completato.",cvc:"Qualsiasi 3 cifre",expiry:"Qualsiasi data futura"}
];

const $ = (id) => document.getElementById(id);
let selectedIndex = 0;
let visibleFixtures = [...FIXTURES];
let toastTimer;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}
function filteredFixtures() {
  const brand = $("brandFilter").value;
  const query = $("searchInput").value.trim().toLowerCase();
  return FIXTURES.map((fixture, index) => ({...fixture, index}))
    .filter(f => (brand === "all" || f.brand === brand) &&
      `${f.brand} ${f.scenario} ${f.description}`.toLowerCase().includes(query));
}
function render() {
  visibleFixtures = filteredFixtures();
  $("resultCount").textContent = visibleFixtures.length;
  const list = $("cardList");
  list.replaceChildren();
  if (!visibleFixtures.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Nessuno scenario trovato. Modifica i filtri.";
    list.append(empty);
    $("detailPanel").hidden = true;
    return;
  }
  visibleFixtures.forEach(f => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `fixture${f.index === selectedIndex ? " selected" : ""}`;
    button.setAttribute("aria-label", `${f.brand}: ${f.scenario}`);
    const icon = document.createElement("span");
    icon.className = "brand-icon";
    icon.textContent = f.short;
    const copy = document.createElement("span");
    copy.className = "fixture-copy";
    const title = document.createElement("strong");
    title.textContent = `${f.brand} · ${f.scenario}`;
    const sub = document.createElement("span");
    sub.textContent = f.number;
    copy.append(title, sub);
    const arrow = document.createElement("span");
    arrow.className = "chevron";
    arrow.textContent = "›";
    button.append(icon, copy, arrow);
    button.addEventListener("click", () => {
      selectedIndex = f.index;
      render();
      $("detailPanel").scrollIntoView({behavior:"smooth", block:"nearest"});
    });
    list.append(button);
  });
  const chosen = visibleFixtures.find(f => f.index === selectedIndex) || visibleFixtures[0];
  selectedIndex = chosen.index;
  showDetails(FIXTURES[selectedIndex]);
}
function showDetails(f) {
  $("detailPanel").hidden = false;
  $("detailBrand").textContent = f.brand;
  $("detailScenario").textContent = f.scenario;
  $("detailNumber").textContent = f.number;
  $("detailDescription").textContent = f.description;
  $("detailCvc").textContent = f.cvc;
  $("detailExpiry").textContent = f.expiry;
}
function currentFixture() { return FIXTURES[selectedIndex]; }
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (!ok) throw new Error("copy failed");
    }
    toast("Copiato negli appunti");
  } catch {
    toast("Copia non riuscita: seleziona il testo manualmente");
  }
}
function fixtureText(f) {
  return `CARDGENERATOR PRO — SOLO TEST\nCircuito: ${f.brand}\nScenario: ${f.scenario}\nNumero test: ${f.number}\nCVC: ${f.cvc}\nScadenza: ${f.expiry}\nNon utilizzare per pagamenti reali.`;
}
function exportCsv() {
  const rows = filteredFixtures();
  const header = ["brand","scenario","test_number","cvc_guidance","expiry_guidance","test_only"];
  const escape = value => `"${String(value).replaceAll('"','""')}"`;
  const csv = [header.join(","), ...rows.map(f =>
    [f.brand,f.scenario,f.number,f.cvc,f.expiry,"YES - NOT FOR REAL PAYMENTS"].map(escape).join(",")
  )].join("\r\n");
  const blob = new Blob(["\ufeff",csv], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "cardgenerator-stripe-test-fixtures.csv";
  document.body.append(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast("CSV esportato");
}
async function shareFixture() {
  const text = fixtureText(currentFixture());
  if (navigator.share) {
    try { await navigator.share({title:"CardGenerator Pro — test fixture",text}); }
    catch (err) { if (err.name !== "AbortError") toast("Condivisione non disponibile"); }
  } else {
    await copyText(text);
  }
}
function showInstallHelp() { $("installDialog").showModal(); }

$("brandFilter").addEventListener("change", render);
$("searchInput").addEventListener("input", render);
$("copyNumber").addEventListener("click", () => copyText(currentFixture().number.replaceAll(" ","")));
$("copyAll").addEventListener("click", () => copyText(fixtureText(currentFixture())));
$("shareFixture").addEventListener("click", shareFixture);
$("exportCsv").addEventListener("click", exportCsv);
$("installHelp").addEventListener("click", showInstallHelp);
$("closeDialog").addEventListener("click", () => $("installDialog").close());
$("okDialog").addEventListener("click", () => $("installDialog").close());

render();
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => toast("Cache offline non disponibile"));
  });
}

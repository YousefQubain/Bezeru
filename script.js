/* =========================
   BEZERU script.js
   - Analog mini watches per timezone (LIVE)
   - Latest stories cards from posts.json
   - Never breaks layout (z-index handled in CSS)
========================= */

function pad2(n){ return String(n).padStart(2, "0"); }

function getTZParts(timeZone){
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const parts = dtf.formatToParts(new Date());
  const hh = Number(parts.find(p => p.type === "hour")?.value ?? "0");
  const mm = Number(parts.find(p => p.type === "minute")?.value ?? "0");
  return { hh, mm };
}

function renderMiniWatchSVG(){
  // Note: hands are rotated by JS.
  return `
  <svg viewBox="0 0 100 100" width="44" height="44" aria-hidden="true">
    <!-- bezel ring -->
    <defs>
      <radialGradient id="dial" cx="50%" cy="45%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%"

// Harbour Pools — single-card navigator (clean rebuild)
// LocalStorage keys
const LS = { VISITED:'harbour_pools_visited_v3', INDEX:'harbour_pools_index_v3' };

// Data
const pools = [
  { name: "Parsley Bay Swimming Enclosure, Vaucluse", lat: -33.852746, lng: 151.278041, type: "enclosure" },
  { name: "Nielsen Park – Shark Beach, Vaucluse", lat: -33.850846, lng: 151.268571, type: "netted" },
  { name: "Watsons Bay Baths, Watsons Bay", lat: -33.844243, lng: 151.281703, type: "enclosure" },
  { name: "Murray Rose Pool (Redleaf), Double Bay", lat: -33.872072, lng: 151.247724, type: "enclosure" },
  { name: "Marrinawi Cove, Barangaroo", lat: -33.859000, lng: 151.199000, type: "enclosure" },
  { name: "Maccallum Seawater Pool, Cremorne Point", lat: -33.845320, lng: 151.228080, type: "tidal pool" },
  { name: "Balmoral Baths, Mosman", lat: -33.825413, lng: 151.251602, type: "netted" },
  { name: "Clifton Gardens (Chowder Bay) netted enclosure, Mosman", lat: -33.842110, lng: 151.247550, type: "netted" },
  { name: "Northbridge Baths, Sailors Bay", lat: -33.806626, lng: 151.221141, type: "tidal baths" },
  { name: "Greenwich Baths, Greenwich", lat: -33.841520, lng: 151.182880, type: "netted" },
  { name: "Little Manly Cove tidal/netted pool, Manly", lat: -33.806764, lng: 151.286668, type: "netted" },
  { name: "Forty Baskets Beach netted enclosure, Balgowlah", lat: -33.802309, lng: 151.269516, type: "netted" },
  { name: "Woolwich Baths (Lane Cove River)", lat: -33.840300, lng: 151.170200, type: "tidal baths" },
  { name: "Chiswick Baths (Parramatta River)", lat: -33.850000, lng: 151.140000, type: "netted" },
  { name: "Dawn Fraser Baths, Balmain", lat: -33.856095, lng: 151.170644, type: "tidal baths" }
];

// State
let visited = JSON.parse(localStorage.getItem(LS.VISITED) || '{}');
let idx = Math.min(Math.max(0, Number(localStorage.getItem(LS.INDEX) || 0)), POOLS.length-1);

// Elements
const el = (id)=>document.getElementById(id);
const listView = el('listView');
const passportView = el('passportView');
const poolName = el('poolName');
const counter = el('counter');
const visitedToggle = el('visitedToggle');
const mapToggle = el('mapToggle');
const passportGrid = el('passportGrid');
const tabPools = el('tabPools');
const tabPassport = el('tabPassport');
const prevBtn = el('prevBtn');
const nextBtn = el('nextBtn');
const resetBtn = el('resetBtn');

// Map
let map, marker;
function initMap(){
  map = L.map('map', { zoomControl: true, attributionControl:false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
  marker = L.marker([0,0]).addTo(map);
}

// Render
function renderCard(){
  const p = POOLS[idx];
  poolName.textContent = p.name;
  marker.setLatLng([p.lat, p.lon]);
  map.setView([p.lat, p.lon], 15);
  visitedToggle.checked = !!visited[p.name];
  updateCounter();
  localStorage.setItem(LS.INDEX, String(idx));
}
function updateCounter(){
  const n = Object.values(visited).filter(Boolean).length;
  counter.textContent = `${n}/${POOLS.length} swum`;
}
function renderPassport(){
  passportGrid.innerHTML = '';
  POOLS.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'stamp';
    div.innerHTML = `<div class="ok">${visited[p.name] ? '✅' : '⬜️'}</div><div class="name">${p.name}</div>`;
    passportGrid.appendChild(div);
  });
}

// Actions
function setVisited(flag){
  visited[POOLS[idx].name] = !!flag;
  localStorage.setItem(LS.VISITED, JSON.stringify(visited));
  updateCounter();
  renderPassport();
}
function next(){ idx = (idx+1) % POOLS.length; renderCard(); }
function prev(){ idx = (idx-1+POOLS.length) % POOLS.length; renderCard(); }

function showPools(){ listView.classList.remove('hidden'); passportView.classList.add('hidden'); tabPools.classList.add('active'); tabPassport.classList.remove('active'); }
function showPassport(){ passportView.classList.remove('hidden'); listView.classList.add('hidden'); tabPassport.classList.add('active'); tabPools.classList.remove('active'); }

// Fullscreen map toggle
let full = false;
function toggleMap(){
  full = !full;
  const mapEl = document.getElementById('map');
  if(full){
    mapEl.classList.add('fullscreen');
    mapToggle.setAttribute('aria-pressed','true');
    mapToggle.textContent = '🗺️ Exit Full Map';
  }else{
    mapEl.classList.remove('fullscreen');
    mapToggle.setAttribute('aria-pressed','false');
    mapToggle.textContent = '🗺️ Full Map';
  }
  setTimeout(()=>{ map.invalidateSize(); }, 210);
}

// Exit to splash or parent
function wireExit(){
  const exitBtn = document.getElementById('exitBtn');
  exitBtn.addEventListener('click', () => {
    try { window.parent && window.parent.postMessage({type:'WADS_EXIT'}, '*'); } catch(e){}
    try { location.href = 'index.html'; } catch(e){}
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderPassport();
  renderCard();

  // events
  visitedToggle.addEventListener('change', (e)=> setVisited(e.target.checked));
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') next();
    else if(e.key==='ArrowLeft') prev();
  });
  mapToggle.addEventListener('click', toggleMap);
  tabPools.addEventListener('click', showPools);
  tabPassport.addEventListener('click', showPassport);
  resetBtn.addEventListener('click', ()=>{
    if(confirm('Clear all stamps?')){
      visited = {};
      localStorage.setItem(LS.VISITED, JSON.stringify(visited));
      updateCounter(); renderPassport();
    }
  });

  wireExit();
});

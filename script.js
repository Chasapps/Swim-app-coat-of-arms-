// Harbour Pools — single-card navigator (clean rebuild)
// LocalStorage keys
const LS = { VISITED:'harbour_pools_visited_v3', INDEX:'harbour_pools_index_v3' };

// Data
const POOLS = [
  {name:'Woolwich Baths', lat:-33.83914, lon:151.16943},
  {name:'Northbridge Baths', lat:-33.80637, lon:151.22233},
  {name:'Greenwich Baths', lat:-33.84102, lon:151.18341},
  {name:'Dawn Fraser Baths', lat:-33.85354, lon:151.17325},
  {name:'Clontarf Beach Baths', lat:-33.80680, lon:151.25121},
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

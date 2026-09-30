const state = { step: 0, name:'', dob:'', docType:'Passport', docNumber:'' };
const totalSteps = 4;

function renderProgress(){
  const el = document.getElementById('progress');
  el.innerHTML = '';
  for(let i=0;i<totalSteps;i++){
    const seg = document.createElement('i');
    const fill = document.createElement('b');
    if(i < state.step) fill.style.transform = 'scaleX(1)';
    seg.appendChild(fill);
    el.appendChild(seg);
  }
  document.getElementById('backBtn').disabled = state.step === 0;
}

function goBack(){
  if(state.step > 0){ state.step--; render(); }
}

function screens(){
  return [screenDetails, screenDocScan, screenFace, screenReview, screenSuccess];
}

function render(){
  renderProgress();
  const body = document.getElementById('body');
  body.innerHTML = '';
  screens()[Math.min(state.step,4)](body);
}

function screenDetails(body){
  body.innerHTML = `
    <div class="step-label">1 of ${totalSteps}</div>
    <h1>Your details</h1>
    <div class="sub">Enter them exactly as they appear on the document you're about to scan.</div>
    <div class="field">
      <label>FULL LEGAL NAME</label>
      <input id="in-name" placeholder="Jordan Blake" value="${state.name}">
    </div>
    <div class="field">
      <label>DATE OF BIRTH</label>
      <input id="in-dob" placeholder="DD / MM / YYYY" value="${state.dob}">
    </div>
    <div class="field">
      <label>DOCUMENT TYPE</label>
      <div class="seg">
        <button id="seg-passport" class="${state.docType==='Passport'?'active':''}">Passport</button>
        <button id="seg-national" class="${state.docType==='National ID'?'active':''}">National ID</button>
      </div>
    </div>
    <div class="field">
      <label>DOCUMENT NUMBER</label>
      <input id="in-doc" placeholder="A12345678" value="${state.docNumber}">
    </div>
    <div class="spacer"></div>
    <button class="primary" id="continueBtn">Continue ›</button>
    <div class="foot-note">🔒 Your data is encrypted end to end</div>
  `;
  const nameI = document.getElementById('in-name');
  const dobI = document.getElementById('in-dob');
  const docI = document.getElementById('in-doc');
  const btn = document.getElementById('continueBtn');
  function check(){ btn.disabled = !(nameI.value && dobI.value && docI.value); }
  [nameI,dobI,docI].forEach(i=>i.addEventListener('input', check));
  document.getElementById('seg-passport').onclick = ()=>{state.docType='Passport'; render();};
  document.getElementById('seg-national').onclick = ()=>{state.docType='National ID'; render();};
  check();
  btn.onclick = ()=>{
    state.name=nameI.value; state.dob=dobI.value; state.docNumber=docI.value;
    state.step=1; render();
  };
}

function screenDocScan(body){
  body.innerHTML = `
    <div class="step-label">2 of ${totalSteps}</div>
    <h1>Scan your ${state.docType.toLowerCase()}</h1>
    <div class="sub">Lay it flat on a dark surface and keep it still while we read it.</div>
    <div class="scan-wrap">
      <div class="doc-frame">
        <div class="line"></div>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--sub)" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2.2"/><path d="M13 10h6M13 14h4"/></svg>
      </div>
      <div class="scan-status">
        <div class="pct" id="pct">0%</div>
        <div class="pct-label">Checking security features</div>
      </div>
    </div>
  `;
  runProgress(document.getElementById('pct'), ()=>{ state.step=2; render(); });
}

function screenFace(body){
  body.innerHTML = `
    <div class="step-label">3 of ${totalSteps}</div>
    <h1>Face verification</h1>
    <div class="sub">A quick liveness check confirms the document belongs to you.</div>
    <div class="scan-wrap">
      <div class="face-ring">
        <svg viewBox="0 0 180 180">
          <circle class="track" cx="90" cy="90" r="80" stroke-width="3" fill="none"/>
          <circle class="prog" id="ring" cx="90" cy="90" r="80" stroke-width="3" fill="none"
            stroke-dasharray="502" stroke-dashoffset="502"/>
        </svg>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text)" stroke-width="1.3">
          <circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="0.6" fill="var(--text)"/><circle cx="15" cy="10" r="0.6" fill="var(--text)"/>
          <path d="M8.5 14.5c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5"/>
        </svg>
      </div>
      <div class="scan-status">
        <div class="pct" id="pct">0%</div>
        <div class="pct-label">Matching against your document</div>
      </div>
    </div>
  `;
  const ring = document.getElementById('ring');
  const circumference = 502;
  runProgress(document.getElementById('pct'), ()=>{ state.step=3; render(); }, (p)=>{
    ring.style.strokeDashoffset = circumference - (circumference*p/100);
  });
}

function runProgress(pctEl, onDone, onTick){
  let p = 0;
  const timer = setInterval(()=>{
    p += 2 + Math.random()*3;
    if(p >= 100){ p = 100; clearInterval(timer); setTimeout(onDone, 350); }
    pctEl.textContent = Math.round(p) + '%';
    if(onTick) onTick(p);
  }, 45);
}

function screenReview(body){
  body.innerHTML = `
    <div class="step-label">4 of ${totalSteps}</div>
    <h1>Review</h1>
    <div class="sub">Make sure everything matches your document before we confirm.</div>
    <div class="review-row"><span>Full name</span><span>${state.name}</span></div>
    <div class="review-row"><span>Date of birth</span><span>${state.dob}</span></div>
    <div class="review-row"><span>Document type</span><span>${state.docType}</span></div>
    <div class="review-row"><span>Document number</span><span>${state.docNumber}</span></div>
    <div class="spacer"></div>
    <button class="primary" id="confirmBtn" type="button">Confirm and verify ›</button>
  `;
}

function screenSuccess(body){
  document.getElementById('backBtn').disabled = true;
  body.innerHTML = `
    <div class="success-wrap">
      <div class="check">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1>Identity verified</h1>
      <div class="sub">Your account is fully unlocked.</div>
      <div class="card">
        <div class="badge">${(state.name||'?').charAt(0).toUpperCase()}</div>
        <div>
          <div class="t1">${state.name || 'Your account'}</div>
          <div class="t2">Tier 3 · Full access</div>
        </div>
      </div>
      <div class="foot-note">Transfer limits raised · Card ordering unlocked</div>
      <div class="success-actions">
        <button class="primary" id="resetBtn" type="button">Start over</button>
      </div>
    </div>
  `;
}

function resetFlow(){
  state.step=0; state.name=''; state.dob=''; state.docType='Passport'; state.docNumber='';
  render();
}

document.getElementById('backBtn').addEventListener('click', goBack);
document.getElementById('body').addEventListener('click', (event) => {
  if (event.target.closest('#confirmBtn')) { state.step = 4; render(); }
  if (event.target.closest('#resetBtn')) resetFlow();
});

render();

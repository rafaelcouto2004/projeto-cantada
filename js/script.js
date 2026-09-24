// partículas de fundo
  const pWrap = document.getElementById('particles');
  for(let i=0;i<14;i++){
    const s = document.createElement('span');
    s.className = 'p' + (i % 2 ? ' pink' : '');
    s.style.left = (Math.random()*100) + '%';
    const dur = 14 + Math.random()*12;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = (-Math.random()*dur) + 's';
    pWrap.appendChild(s);
  }

  // transição entre telas
  const dots = {step1:'dot1', step2:'dot2', step2b:'dot2', step3:'dot3'};
  let current = 'step1';
  function showStep(id){
    const cur = document.getElementById(current);
    const next = document.getElementById(id);
    cur.classList.remove('enter');
    cur.classList.add('leave');
    setTimeout(() => {
      cur.classList.remove('active','leave');
      next.classList.add('active','enter');
      setTimeout(() => next.classList.remove('enter'), 460);
    }, 260);
    Object.values(dots).forEach(d => document.getElementById(d).classList.remove('active'));
    document.getElementById(dots[id]).classList.add('active');
    current = id;
  }

  const zone = document.querySelector('.dodge-zone');
  const yesBtn = document.getElementById('btnYes');
  const taunts = ["tenta de novo","quase","ele foge rapidinho","difícil, né?","ainda dá tempo de mudar de ideia"];
  let tries = 0;
  function dodge(){
    tries++;
    document.getElementById('taunt').textContent = taunts[(tries-1) % taunts.length];
    const zw = zone.clientWidth, zh = zone.clientHeight;
    const bw = yesBtn.offsetWidth, bh = yesBtn.offsetHeight;
    const maxLeft = Math.max(zw - bw, 40);
    const maxTop = Math.max(zh - bh, 0);
    yesBtn.style.left = (Math.random()*maxLeft + bw/2) + 'px';
    yesBtn.style.top = (Math.random()*maxTop) + 'px';
  }
  function goStep2(){ showStep('step2'); buildCalendar(); }

  // calendário
  const dows = ['D','S','T','Q','Q','S','S'];
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const today = new Date();
  let viewYear = today.getFullYear(), viewMonth = today.getMonth(), selectedDay = null;
  function changeMonth(delta){
    viewMonth += delta;
    if(viewMonth<0){viewMonth=11;viewYear--;}
    if(viewMonth>11){viewMonth=0;viewYear++;}
    buildCalendar();
  }
  function buildCalendar(){
    document.getElementById('calLabel').textContent = months[viewMonth] + ' de ' + viewYear;
    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';
    dows.forEach(d=>{const el=document.createElement('div');el.className='cal-dow';el.textContent=d;grid.appendChild(el);});
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
    for(let i=0;i<firstDow;i++) grid.appendChild(document.createElement('div'));
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    for(let d=1; d<=daysInMonth; d++){
      const btn = document.createElement('button');
      btn.className = 'cal-day'; btn.type='button'; btn.textContent = d;
      const thisDate = new Date(viewYear, viewMonth, d);
      if(thisDate < t0){ btn.disabled = true; } else { btn.onclick = () => selectDay(d); }
      if(thisDate.getTime() === t0.getTime()) btn.classList.add('today');
      if(selectedDay && selectedDay.y===viewYear && selectedDay.m===viewMonth && selectedDay.d===d) btn.classList.add('selected');
      grid.appendChild(btn);
    }
  }
  function selectDay(d){ selectedDay = {y:viewYear,m:viewMonth,d:d}; buildCalendar(); checkReady(); }
  document.getElementById('tm').addEventListener('input', checkReady);
  function checkReady(){
    const tmVal = document.getElementById('tm').value;
    document.getElementById('btnSave').disabled = !(selectedDay && tmVal);
  }

  let finalDate = null;
  const whatsappNumber = '5551998352750';
  function save(){
    if(!selectedDay) return;
    const tmVal = document.getElementById('tm').value;
    if(!tmVal) return;
    const [hh,mm] = tmVal.split(':');
    finalDate = new Date(selectedDay.y, selectedDay.m, selectedDay.d, +hh, +mm);
    showStep('step2b');
  }
  function finalize(idea){
    if(!finalDate) return;
    try{
      localStorage.setItem('cantada-data', finalDate.toISOString());
      localStorage.setItem('cantada-programa', idea);
    }catch(e){}
    const formatted = finalDate.toLocaleString('pt-BR', {weekday:'long',day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit'});
    document.getElementById('whenText').textContent = formatted;
    document.getElementById('ideaText').textContent = idea;
    showStep('step3');
    setTimeout(() => {
      const ring = document.querySelector('.ping-wrap');
      ring.style.animation = 'none'; ring.offsetHeight; ring.style.animation = '';
    }, 300);
  }
  function sendWhatsApp(){
    if(!finalDate) return;
    const idea = document.getElementById('ideaText').textContent;
    const when = document.getElementById('whenText').textContent;
    const message = `Oi! Eu escolhi ${idea} em ${when}.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  try{
    const saved = localStorage.getItem('cantada-data');
    if(saved){
      const d = new Date(saved);
      selectedDay = {y:d.getFullYear(), m:d.getMonth(), d:d.getDate()};
      viewYear = d.getFullYear(); viewMonth = d.getMonth();
      document.getElementById('tm').value = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
    }
  }catch(e){}

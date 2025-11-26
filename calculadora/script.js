// Calculadora simple
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');
  let expression = '';
  let memory = 0; // memoria M+
  const history = []; // historial de operaciones

  function updateDisplay(value) {
    display.value = value;
  }

  function insert(value) {
    // evitar operadores consecutivos
    if (/^[+\-*/]$/.test(value) && expression === '') return;
    if (/^[+\-*/]$/.test(value) && /[+\-*/]$/.test(expression)) {
      // reemplazar operador final
      expression = expression.replace(/[+\-*/]+$/, value);
    } else {
      expression += value;
    }
    updateDisplay(expression);
  }

  function clearAll() {
    expression = '';
    updateDisplay('');
  }

  function resetAll() {
    clearAll();
    memory = 0;
    renderHistory();
    // remove visual active class if present on other parts of the site
    const activeBoxes = document.querySelectorAll('.activo');
    activeBoxes.forEach(n => n.classList.remove('activo'));
  }

  function compute() {
    if (expression === '') return;
    try {
      // Prepare expression: map scientific names to JS Math and helpers
      const safeExpr = prepareExpression(expression);
      // Evaluate using math.js with a restricted scope to avoid arbitrary global access
      const scope = {
        fact,
        __sin: window.__sin,
        __cos: window.__cos,
        __tan: window.__tan,
        __asin: window.__asin,
        __acos: window.__acos,
        __atan: window.__atan,
      };
      const rawEval = window.math ? window.math.evaluate(safeExpr, scope) : null;
      const raw = (rawEval && typeof rawEval.valueOf === 'function') ? rawEval.valueOf() : rawEval;
      const result = normalizeResult(raw);
      // push to history
      history.unshift({ expr: expression, result });
      renderHistory();
      expression = String(result.valueForNext || result.value);
      updateDisplay(result.display);
      flashDisplay();
    } catch (e) {
      updateDisplay('Error');
      expression = '';
    }
  }

  // Normalize result: rounding and formatting
  function normalizeResult(v) {
    if (typeof v !== 'number' || !isFinite(v)) return { value: 0, display: 'Error' };
    // limit to 12 significant digits
    const maxDigits = 12;
    const rounded = Number.parseFloat(Number(v).toPrecision(maxDigits));
    // display with locale separator but keep dot as decimal separator
    const parts = String(rounded).split('.');
    const intPart = Number(parts[0]).toLocaleString();
    const display = parts[1] ? `${intPart}.${parts[1]}` : intPart;
    return { value: rounded, display, valueForNext: rounded };
  }

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (!action) return;

    // Ripple effect on click (positioned at pointer)
    createRipple(btn, e);

    if (action === 'clear') {
      clearAll();
      return;
    }
    if (action === 'reset') {
      resetAll();
      return;
    }
    if (action === 'equals') {
      compute();
      return;
    }

    if (action === 'decimal') {
      // prevenir varios puntos en el número actual
      const parts = expression.split(/[+\-*/]/);
      const last = parts[parts.length - 1];
      if (last.includes('.')) return;
      insert('.');
      return;
    }

    // operadores nombrados
    if (action === 'add') return insert('+');
    if (action === 'subtract') return insert('-');
    if (action === 'multiply') return insert('*');
    if (action === 'divide') return insert('/');

    // número
    if (/^\d+$/.test(action)) {
      insert(action);
    }
  });

  // Soporte de teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      compute();
      flashDisplay();
      return;
    }
    if (e.key === 'Escape') {
      clearAll();
      return;
    }
    if (/^[0-9]$/.test(e.key)) {
      insert(e.key);
      return;
    }
    if (e.key === '.') {
      // decimal
      const parts = expression.split(/[+\-*/]/);
      const last = parts[parts.length - 1];
      if (!last.includes('.')) insert('.');
      return;
    }
    if (['+','-','*','/'].includes(e.key)) {
      insert(e.key);
      animateKeyFor(e.key);
      return;
    }
  });

  // Memory functions
  const btnMPlus = document.getElementById('btnMPlus');
  const btnMR = document.getElementById('btnMR');
  const btnReset = document.getElementById('btnReset');
  const btnTheme = document.getElementById('btnTheme');
  const btnSci = document.getElementById('btnSci');
  const sciKeys = document.getElementById('sciKeys');

  if (btnMPlus) btnMPlus.addEventListener('click', () => {
    const val = parseDisplayNumber(display.value);
    if (val != null) memory = val; // store value
    btnMPlus.classList.add('pressed');
    setTimeout(() => btnMPlus.classList.remove('pressed'), 140);
  });
  if (btnMR) btnMR.addEventListener('click', () => {
    // recall memory into expression
    insert(String(memory));
    btnMR.classList.add('pressed');
    setTimeout(() => btnMR.classList.remove('pressed'), 140);
  });
  if (btnReset) btnReset.addEventListener('click', () => { resetAll(); btnReset.classList.add('pressed'); setTimeout(()=>btnReset.classList.remove('pressed'),140); });

  // Theme toggle
  if (btnTheme) {
    const saved = localStorage.getItem('calc-theme');
    if (saved) document.body.setAttribute('data-theme', saved);
    btnTheme.addEventListener('click', () => {
      const cur = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', cur === 'dark' ? 'dark' : '');
      localStorage.setItem('calc-theme', cur === 'dark' ? 'dark' : '');
    });
  }

  // Background controls: toggle + load custom image
  const btnBgToggle = document.getElementById('btnBgToggle');
  const bgFile = document.getElementById('bgFile');
  const defaultBgUrl = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80";
  // Load saved custom background or hidden state
  const savedBg = localStorage.getItem('calc-bg');
  const savedBgHidden = localStorage.getItem('calc-bg-hidden') === 'true';
  if (savedBg) {
    document.body.style.backgroundImage = `linear-gradient(180deg, rgba(10,15,30,0.20), rgba(255,255,255,0.02)), url('${savedBg}')`;
  }
  if (savedBgHidden) document.body.setAttribute('data-bg', 'hidden');

  if (btnBgToggle) {
    btnBgToggle.addEventListener('click', () => {
      const hidden = document.body.getAttribute('data-bg') === 'hidden';
      if (hidden) {
        document.body.removeAttribute('data-bg');
        localStorage.setItem('calc-bg-hidden', 'false');
      } else {
        document.body.setAttribute('data-bg', 'hidden');
        localStorage.setItem('calc-bg-hidden', 'true');
      }
      btnBgToggle.classList.add('pressed');
      setTimeout(() => btnBgToggle.classList.remove('pressed'), 160);
    });
  }

  if (bgFile) {
    bgFile.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        // Set as background and save
        document.body.style.backgroundImage = `linear-gradient(180deg, rgba(10,15,30,0.20), rgba(255,255,255,0.02)), url('${dataUrl}')`;
        localStorage.setItem('calc-bg', dataUrl);
        // Ensure background is visible
        document.body.removeAttribute('data-bg');
        localStorage.setItem('calc-bg-hidden', 'false');
      };
      reader.readAsDataURL(f);
    });
  }

  // Allow resetting to default background when removing custom
  function resetBackgroundToDefault() {
    document.body.style.backgroundImage = `linear-gradient(180deg, rgba(10,15,30,0.20), rgba(255,255,255,0.02)), url('${defaultBgUrl}')`;
    localStorage.removeItem('calc-bg');
    localStorage.setItem('calc-bg-hidden', 'false');
    document.body.removeAttribute('data-bg');
  }

  // Degree / Radian toggle
  const btnDegToggle = document.getElementById('btnDegToggle');
  // default to degrees (true) for user-friendliness
  let isDegrees = localStorage.getItem('calc-deg') === null ? true : localStorage.getItem('calc-deg') === 'true';
  // expose a window flag that helper trig functions will read
  window.__isDegrees = isDegrees;
  if (btnDegToggle) {
    btnDegToggle.setAttribute('aria-pressed', String(isDegrees));
    btnDegToggle.textContent = isDegrees ? 'Deg' : 'Rad';
    btnDegToggle.addEventListener('click', () => {
      isDegrees = !isDegrees;
      window.__isDegrees = isDegrees;
      localStorage.setItem('calc-deg', String(isDegrees));
      btnDegToggle.setAttribute('aria-pressed', String(isDegrees));
      btnDegToggle.textContent = isDegrees ? 'Deg' : 'Rad';
      btnDegToggle.classList.add('pressed');
      setTimeout(() => btnDegToggle.classList.remove('pressed'), 160);
    });
  }

  // Trig helper wrappers that respect degrees mode. Exposed globally so evaluator can call them.
  window.__sin = function(x){
    const v = Number(x);
    return Math.sin(window.__isDegrees ? v * Math.PI / 180 : v);
  };
  window.__cos = function(x){
    const v = Number(x);
    return Math.cos(window.__isDegrees ? v * Math.PI / 180 : v);
  };
  window.__tan = function(x){
    const v = Number(x);
    return Math.tan(window.__isDegrees ? v * Math.PI / 180 : v);
  };
  window.__asin = function(x){
    const v = Number(x);
    const out = Math.asin(v);
    return window.__isDegrees ? out * 180 / Math.PI : out;
  };
  window.__acos = function(x){
    const v = Number(x);
    const out = Math.acos(v);
    return window.__isDegrees ? out * 180 / Math.PI : out;
  };
  window.__atan = function(x){
    const v = Number(x);
    const out = Math.atan(v);
    return window.__isDegrees ? out * 180 / Math.PI : out;
  };

  // ------------------ Converter logic ------------------
  const btnConverter = document.getElementById('btnConverter');
  const converter = document.getElementById('converter');
  const closeConv = document.getElementById('closeConv');

  if (btnConverter && converter) {
    btnConverter.addEventListener('click', () => {
      const open = converter.getAttribute('aria-hidden') === 'false';
      converter.setAttribute('aria-hidden', String(open));
      if (!open) converter.setAttribute('aria-hidden', 'false');
      else converter.setAttribute('aria-hidden', 'true');
      btnConverter.classList.toggle('pressed', !open);
    });
  }
  if (closeConv && converter) closeConv.addEventListener('click', () => { converter.setAttribute('aria-hidden','true'); btnConverter.classList.remove('pressed'); });

  // Tabs
  document.querySelectorAll('.conv-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.conv-tabs .tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const name = tab.getAttribute('data-tab');
      document.querySelectorAll('.conv-panel').forEach(p=>p.hidden=true);
      document.getElementById('conv-'+name).hidden = false;
    });
  });

  // Temperature
  const tempValue = document.getElementById('tempValue');
  const tempFrom = document.getElementById('tempFrom');
  const tempTo = document.getElementById('tempTo');
  const btnTempConvert = document.getElementById('btnTempConvert');
  const tempResult = document.getElementById('tempResult');
  function convertTemp(v, from, to) {
    const x = Number(v);
    if (!isFinite(x)) return '—';
    let c;
    if (from === 'Celsius') c = x;
    if (from === 'Fahrenheit') c = (x - 32) * 5/9;
    if (from === 'Kelvin') c = x - 273.15;
    let out;
    if (to === 'Celsius') out = c;
    if (to === 'Fahrenheit') out = c * 9/5 + 32;
    if (to === 'Kelvin') out = c + 273.15;
    return Number.parseFloat(out.toFixed(4));
  }
  if (btnTempConvert) btnTempConvert.addEventListener('click', ()=>{
    const res = convertTemp(tempValue.value, tempFrom.value, tempTo.value);
    tempResult.textContent = String(res);
  });

  // Length converter (meters, km, mi, cm, in)
  const lenValue = document.getElementById('lenValue');
  const lenFrom = document.getElementById('lenFrom');
  const lenTo = document.getElementById('lenTo');
  const btnLenConvert = document.getElementById('btnLenConvert');
  const lenResult = document.getElementById('lenResult');
  const lengthFactors = { m:1, km:1000, cm:0.01, in:0.0254, mi:1609.344 };
  function convertLength(v, from, to) {
    const x = Number(v); if (!isFinite(x)) return '—';
    const meters = x * lengthFactors[from];
    const out = meters / lengthFactors[to];
    return Number.parseFloat(out.toFixed(6));
  }
  if (btnLenConvert) btnLenConvert.addEventListener('click', ()=>{
    lenResult.textContent = String(convertLength(lenValue.value,lenFrom.value,lenTo.value));
  });

  // Currency converter: try fetch rates, fallback to local
  const btnCurConvert = document.getElementById('btnCurConvert');
  const curValue = document.getElementById('curValue');
  const curFrom = document.getElementById('curFrom');
  const curTo = document.getElementById('curTo');
  const curResult = document.getElementById('curResult');
  const btnUpdateRates = document.getElementById('btnUpdateRates');
  const ratesInfo = document.getElementById('ratesInfo');

  // fallback static rates w.r.t USD
  let rates = { USD:1, EUR:0.90, GBP:0.78, MXN:20.0 };
  async function updateRatesOnline() {
    try {
      ratesInfo.textContent = 'Actualizando...';
      const resp = await fetch('https://api.exchangerate.host/latest?base=USD');
      const data = await resp.json();
      if (data && data.rates) {
        rates = { USD:1, EUR:data.rates.EUR, GBP:data.rates.GBP, MXN:data.rates.MXN };
        localStorage.setItem('calc-rates', JSON.stringify(rates));
        ratesInfo.textContent = 'Tasas actualizadas';
        drawRatesSparkline();
      }
    } catch (e) {
      ratesInfo.textContent = 'No se pudo actualizar. Usando tasas locales.';
    }
    setTimeout(()=>ratesInfo.textContent='Tasas locales usadas si no hay conexión', 2000);
  }
  // Load saved rates
  const savedRates = localStorage.getItem('calc-rates');
  if (savedRates) try { rates = JSON.parse(savedRates); } catch(e){}
  // draw sparkline initially if we have rates
  setTimeout(()=>{ drawRatesSparkline(); }, 120);
  if (btnUpdateRates) btnUpdateRates.addEventListener('click', updateRatesOnline);

  function convertCurrency(amount, from, to) {
    const a = Number(amount); if (!isFinite(a)) return '—';
    // convert from -> USD -> to
    const inUSD = a / (rates[from] || 1);
    const out = inUSD * (rates[to] || 1);
    return Number.parseFloat(out.toFixed(4));
  }
  if (btnCurConvert) btnCurConvert.addEventListener('click', ()=>{
    curResult.textContent = String(convertCurrency(curValue.value, curFrom.value, curTo.value));
  });

  // Draw a small sparkline for the current rates in #ratesCanvas
  function drawRatesSparkline(animated = true){
    const canvas = document.getElementById('ratesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width = canvas.clientWidth * dpr;
    const h = canvas.height = (canvas.clientHeight || 60) * dpr;
    ctx.clearRect(0,0,w,h);
    // pick a few currencies to display
    const keys = ['EUR','GBP','MXN'];
    const vals = keys.map(k => rates[k] || 0);
    if (vals.every(v=>v===0)) return;
    // normalize to [0..1]
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const norm = vals.map(v => (v - min) / (max - min || 1));
    // build points
    const pad = 6 * dpr;
    const pts = norm.map((n,i)=>{
      const x = (i/(norm.length-1)) * (w - pad*2) + pad;
      const y = h - (n * (h - pad*2) + pad);
      return {x,y};
    });

    ctx.lineWidth = 2 * dpr;
    // stroke gradient from left to right
    const strokeGrad = ctx.createLinearGradient(0,0,w,0);
    strokeGrad.addColorStop(0, 'rgba(59,130,246,0.95)');
    strokeGrad.addColorStop(1, 'rgba(99,102,241,0.95)');
    ctx.strokeStyle = strokeGrad;

    // fill gradient vertical
    const fillGrad = ctx.createLinearGradient(0,0,0,h);
    fillGrad.addColorStop(0, 'rgba(59,130,246,0.18)');
    fillGrad.addColorStop(1, 'rgba(59,130,246,0.02)');

    // smoothing with quadratic curves and fill area
    function buildPath(limitProgress = 1){
      const path = new Path2D();
      if (pts.length === 0) return path;
      path.moveTo(pts[0].x, pts[0].y);
      for (let i=1;i<pts.length;i++){
        const prev = pts[i-1];
        const cur = pts[i];
        // control point as midpoint for smooth quadratic
        const cx = (prev.x + cur.x) / 2;
        const cy = (prev.y + cur.y) / 2;
        const segIndex = i-1;
        const totalSeg = pts.length - 1;
        const segProgress = Math.min(1, Math.max(0, (limitProgress * totalSeg) - segIndex));
        if (segProgress <= 0) break;
        const endX = prev.x + (cur.x - prev.x) * segProgress;
        const endY = prev.y + (cur.y - prev.y) * segProgress;
        path.quadraticCurveTo(prev.x, prev.y, endX, endY);
      }
      return path;
    }

    function drawWithFill(p){
      ctx.clearRect(0,0,w,h);
      const mainPath = buildPath(p);
      // stroke the path
      ctx.save();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = strokeGrad;
      ctx.stroke(mainPath);
      ctx.restore();

      // fill under the curve to bottom
      ctx.save();
      // create a copy path that goes down to baseline
      const fillPath = buildPath(p);
      // find last point from fillPath by using pts and progress
      const progressIndex = Math.floor((pts.length-1) * p);
      const lastPt = pts[Math.max(0, Math.min(pts.length-1, progressIndex))];
      fillPath.lineTo(lastPt.x, h - 2*dpr);
      fillPath.lineTo(pts[0].x, h - 2*dpr);
      fillPath.closePath();
      ctx.fillStyle = fillGrad;
      ctx.fill(fillPath);
      ctx.restore();

      // small white dots
      ctx.fillStyle = 'white';
      const showCount = Math.max(1, Math.round(pts.length * p));
      for (let i=0;i<showCount;i++){
        const pt = pts[i]; ctx.beginPath(); ctx.arc(pt.x, pt.y, 3*dpr, 0, Math.PI*2); ctx.fill();
      }
    }

    // expose points & values for tooltip handlers
    try{ canvas._spark = { pts, vals, keys, dpr }; }catch(e){/* ignore */}

    if (!animated){ drawWithFill(1); return; }
    // animate
    const dur = 520;
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start)/dur);
      const eased = (1 - Math.cos(Math.PI * t)) / 2; // easeInOut
      drawWithFill(eased);
      if (t < 1) requestAnimationFrame(frame);
      else {
        // subtle glow pulse on completion
        canvas.classList.add('rates-updated');
        setTimeout(()=>canvas.classList.remove('rates-updated'), 420);
      }
    }
    requestAnimationFrame(frame);
  }

  // Tooltip element for sparkline
  let _sparkTooltip = null;
  function ensureTooltip(){
    if (_sparkTooltip) return _sparkTooltip;
    _sparkTooltip = document.createElement('div');
    _sparkTooltip.className = 'spark-tooltip';
    document.body.appendChild(_sparkTooltip);
    return _sparkTooltip;
  }

  // Mouse handlers for rates canvas
  const ratesCanvas = document.getElementById('ratesCanvas');
  if (ratesCanvas) {
    ratesCanvas.addEventListener('mousemove', (ev)=>{
      const data = ratesCanvas._spark;
      if (!data || !data.pts || !data.pts.length) return;
      const rect = ratesCanvas.getBoundingClientRect();
      const dpr = data.dpr || 1;
      const x = (ev.clientX - rect.left) * dpr;
      const y = (ev.clientY - rect.top) * dpr;
      // find nearest point
      let best = -1; let bestDist = Infinity;
      for (let i=0;i<data.pts.length;i++){
        const p = data.pts[i];
        const dx = p.x - x; const dy = p.y - y; const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < bestDist){ bestDist = dist; best = i; }
      }
      const threshold = 12 * dpr;
      const tip = ensureTooltip();
      if (best >= 0 && bestDist <= threshold){
        const val = data.vals[best];
        const cur = data.keys[best];
        tip.textContent = `${cur}: ${Number(val).toFixed(4)}`;
        // theme class
        if (document.body.getAttribute('data-theme') === 'dark') tip.classList.remove('light'); else tip.classList.add('light');
        // position tooltip near point (convert canvas coords to client coords)
        const clientX = rect.left + (data.pts[best].x / dpr);
        const clientY = rect.top + (data.pts[best].y / dpr);
        tip.style.left = clientX + 'px';
        tip.style.top = clientY + 'px';
        tip.style.display = 'block';
      } else {
        if (_sparkTooltip) _sparkTooltip.style.display = 'none';
      }
    });
    ratesCanvas.addEventListener('mouseleave', ()=>{ if (_sparkTooltip) _sparkTooltip.style.display = 'none'; });
  }

  // redraw on resize (debounced)
  let _resizeTimer = null;
  window.addEventListener('resize', ()=>{
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(()=>{ drawRatesSparkline(false); }, 180);
  });

  // Scientific panel toggle
  if (btnSci && sciKeys) {
    btnSci.addEventListener('click', () => {
      const open = sciKeys.classList.toggle('open');
      sciKeys.setAttribute('aria-hidden', String(!open));
      btnSci.classList.toggle('pressed', open);
    });
    // handle clicks inside sciKeys
    sciKeys.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (!action) return;
      createRipple(btn, e);
      // mapping for scientific buttons: insert function calls or tokens
      switch (action) {
        case 'sin': insert('sin('); break;
        case 'cos': insert('cos('); break;
        case 'tan': insert('tan('); break;
        case 'asin': insert('asin('); break;
        case 'acos': insert('acos('); break;
        case 'atan': insert('atan('); break;
        case 'sqrt': insert('sqrt('); break;
        case 'ln': insert('ln('); break;
        case 'log': insert('log('); break;
        case 'pow': insert('pow('); break;
        case 'pi': insert('pi'); break;
        case 'fact': insert('fact('); break;
      }
    });
  }

  // Prepare expression mapping scientific names to JS Math calls and helpers
  function prepareExpression(expr) {
    if (!expr) return expr;
    let t = String(expr);
    // replace unicode pi with token
    t = t.replace(/π/g, 'pi');
    // do not replace caret; math.js understands `^` as power.
    // map named functions to Math equivalents or our helpers
    const fnMap = {
      '\\bln\\s*\\(' : 'Math.log(', // ln(
    };
    // simple replacements
    t = t.replace(/\bln\(/gi, 'log(');
    t = t.replace(/\blog\(/gi, 'log10(');
    // Map trig functions to our helpers so they respect Deg/Rad mode
    t = t.replace(/\bsin\(/gi, '__sin(');
    t = t.replace(/\bcos\(/gi, '__cos(');
    t = t.replace(/\btan\(/gi, '__tan(');
    t = t.replace(/\basin\(/gi, '__asin(');
    t = t.replace(/\bacos\(/gi, '__acos(');
    t = t.replace(/\batan\(/gi, '__atan(');
    t = t.replace(/\bsqrt\(/gi, 'sqrt(');
    t = t.replace(/\bpow\(/gi, 'pow(');
    t = t.replace(/\bexp\(/gi, 'exp(');
    // leave `pi` token as-is so math.js can resolve it
    // ensure factorial calls (fact(x)) are kept as fact(x)
    return t;
  }

  // factorial helper used in evaluation
  function fact(n) {
    const x = Number(n);
    if (!Number.isFinite(x) || x < 0) return NaN;
    if (x === 0) return 1;
    // integer factorial; for non-integers return gamma? we return NaN
    if (!Number.isInteger(x)) return NaN;
    let r = 1;
    for (let i = 2; i <= x; i++) r *= i;
    return r;
  }

  // Helpers: parse display string to number ignoring thousands separators
  function parseDisplayNumber(str) {
    if (!str) return null;
    const cleaned = String(str).replace(/,/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
  }

  // Render history
  const historyList = document.getElementById('historyList');
  function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = '';
    history.forEach((h, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="expr">${h.expr}</span><strong>${h.result.display || h.result}</strong>`;
      li.addEventListener('click', () => {
        // use result value for next operation
        expression = String(h.result.value || h.result);
        updateDisplay(h.result.display || h.result);
      });
      historyList.appendChild(li);
    });
  }

  // Export / Import history
  const btnExportHistory = document.getElementById('btnExportHistory');
  const historyFile = document.getElementById('historyFile');
  if (btnExportHistory) btnExportHistory.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify(history, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'calc-history.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { alert('Error exportando historial'); }
  });
  if (historyFile) historyFile.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (Array.isArray(data)) {
          // append imported entries to top
          data.reverse().forEach(it => {
            if (it && it.expr) history.unshift(it);
          });
          renderHistory();
        } else alert('Formato de historial inválido');
      } catch (err) { alert('No se pudo leer el archivo'); }
    };
    r.readAsText(f);
  });

  // Animate display briefly (used on compute)
  function flashDisplay() {
    display.classList.add('pop');
    setTimeout(() => display.classList.remove('pop'), 220);
  }

  // Create ripple element inside a button
  function createRipple(btn, event) {
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 0.9;
    ripple.style.width = ripple.style.height = size + 'px';
    // position: if mouse event available use it, otherwise center
    let x = rect.width / 2;
    let y = rect.height / 2;
    if (event && event.clientX != null) {
      x = event.clientX - rect.left - size / 2;
      y = event.clientY - rect.top - size / 2;
    } else {
      x = (rect.width - size) / 2;
      y = (rect.height - size) / 2;
    }
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  // When keyboard used, find corresponding button and animate briefly
  function animateKeyFor(key) {
    // map operator keys to data-action names
    const map = {'+':'add','-':'subtract','*':'multiply','/':'divide'};
    const action = map[key] || key;
    const btn = document.querySelector(`button[data-action="${action}"]`);
    if (!btn) return;
    btn.classList.add('pressed');
    // show small ripple centered
    createRipple(btn, null);
    setTimeout(() => btn.classList.remove('pressed'), 160);
  }

});

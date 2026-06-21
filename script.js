// ---- helpers ----------------------------------------------------------

function formatNum(n) {
  if (!isFinite(n)) return '0';
  // round tiny float noise away, keep up to 2 decimals only when needed
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function getVal(input) {
  const v = parseFloat(input.value);
  return isNaN(v) ? 0 : v;
}

// ---- populate the "Total Days" dropdowns with 1-15 --------------------

function populateDaySelects() {
  document.querySelectorAll('.days-select').forEach(select => {
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = '—';
    select.appendChild(blank);

    for (let i = 1; i <= 15; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = i;
      select.appendChild(opt);
    }
  });
}

// ---- core calculation ---------------------------------------------------
// nagaokyako: TEKI = Days x 480, TEKI PLUS = 0
// yasu:       TEKI PLUS = Days x 980, TEKI = Days x 1440 (980 + 460)
// TEKI CUT = Salary - TEKI
// 20% CUT  = TEKI CUT * 0.20
// NET      = Salary - 20% CUT

function calcRow(row) {
  const salary = getVal(row.querySelector('.salary-input'));
  const daysVal = row.querySelector('.days-select').value;
  const days = daysVal === '' ? 0 : parseInt(daysVal, 10);
  const tekiRate = parseFloat(row.dataset.tekiRate) || 0;
  const tekiPlusRate = parseFloat(row.dataset.tekiplusRate) || 0;

  const teki = days * tekiRate;
  const tekiPlus = days * tekiPlusRate;
  const tekiCut = salary - teki;
  const cut20 = tekiCut * 0.2;
  const net = salary - cut20;

  row.querySelector('.teki-cell').textContent = formatNum(teki);
  row.querySelector('.tekiplus-cell').textContent = formatNum(tekiPlus);
  row.querySelector('.teki-cut').textContent = formatNum(tekiCut);
  row.querySelector('.cut20').textContent = formatNum(cut20);
  row.querySelector('.net').textContent = formatNum(net);

  return { salary, teki, tekiPlus, tekiCut, cut20, net };
}

function calcAll() {
  const rows = document.querySelectorAll('.data-row');
  const totals = { salary: 0, teki: 0, tekiPlus: 0, tekiCut: 0, cut20: 0, net: 0 };

  rows.forEach(row => {
    const r = calcRow(row);
    totals.salary += r.salary;
    totals.teki += r.teki;
    totals.tekiPlus += r.tekiPlus;
    totals.tekiCut += r.tekiCut;
    totals.cut20 += r.cut20;
    totals.net += r.net;
  });

  document.querySelector('.total-salary').textContent = formatNum(totals.salary);
  document.querySelector('.total-teki').textContent = formatNum(totals.teki);
  document.querySelector('.total-tekiplus').textContent = formatNum(totals.tekiPlus);
  document.querySelector('.total-tekicut').textContent = formatNum(totals.tekiCut);
  document.querySelector('.total-cut20').textContent = formatNum(totals.cut20);
  document.querySelector('.total-net').textContent = formatNum(totals.net);
}

// ---- reset ---------------------------------------------------------------

function resetAll() {
  document.querySelectorAll('.cell-input').forEach(el => {
    if (el.tagName === 'SELECT') el.value = '';
    else el.value = '';
  });
  calcAll();
}

// ---- wire up ---------------------------------------------------------------

document.addEventListener('input', e => {
  if (e.target.matches('.salary-input')) calcAll();
});

document.addEventListener('change', e => {
  if (e.target.matches('.days-select')) calcAll();
});

document.getElementById('reset-btn').addEventListener('click', resetAll);

window.addEventListener('DOMContentLoaded', () => {
  populateDaySelects();
  calcAll();
});

const ANSWER_KEYS = {
  '16': ['b','c','b','b','b','c','b','c','b','b','c','b'],
  '19': ['b','b','c','b','c','b','c','b','c','b','b','b'],
  '20': ['b','b','b','b','c','b','b','b','b','b','b','b'],
  '21': ['b','b','c','c','c','b','b','b','b','b','b','b'],
};

function getContainer(ch) {
  return document.getElementById('q' + ch + '-container');
}

function updateProgress(ch) {
  const container = getContainer(ch);
  if (!container) return;
  const total = ANSWER_KEYS[ch].length;
  const answered = new Set();
  container.querySelectorAll('input[type=radio]:checked').forEach(r => answered.add(r.name));
  const count = answered.size;
  const fill = document.getElementById('prog' + ch);
  const label = document.getElementById('prog' + ch + '-text');
  if (fill) fill.style.width = Math.round((count / total) * 100) + '%';
  if (label) label.textContent = count + ' / ' + total;
}

function submitQuiz(ch) {
  const container = getContainer(ch);
  if (!container) return;
  const key = ANSWER_KEYS[ch];
  let score = 0;

  key.forEach((correct, i) => {
    const name = 'q' + ch + '_' + i;
    const allInputs = container.querySelectorAll('input[name="' + name + '"]');
    allInputs.forEach(inp => {
      inp.closest('label').classList.remove('correct', 'wrong', 'selected');
    });

    const checked = container.querySelector('input[name="' + name + '"]:checked');
    const correctInput = container.querySelector('input[name="' + name + '"][value="' + correct + '"]');

    if (checked) {
      if (checked.value === correct) {
        score++;
        checked.closest('label').classList.add('correct');
      } else {
        checked.closest('label').classList.add('wrong');
        if (correctInput) correctInput.closest('label').classList.add('correct');
      }
    } else {
      if (correctInput) correctInput.closest('label').classList.add('correct');
    }

    allInputs.forEach(inp => inp.disabled = true);
  });

  const total = key.length;
  const pct = Math.round((score / total) * 100);

  const scoreNum = document.getElementById('score' + ch + '-num');
  const resultMsg = document.getElementById('result' + ch + '-msg');
  const banner = document.getElementById('result' + ch);
  const scoreBadge = document.getElementById('score' + ch);

  if (scoreNum) scoreNum.textContent = score;
  if (scoreBadge) scoreBadge.textContent = 'Score: ' + score + '/' + total;
  if (resultMsg) resultMsg.textContent = pct >= 70 ? '✓ Great work' : '✗ Keep studying';
  if (banner) {
    banner.classList.add('show');
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const fill = document.getElementById('prog' + ch);
  const label = document.getElementById('prog' + ch + '-text');
  if (fill) fill.style.width = '100%';
  if (label) label.textContent = total + ' / ' + total;
}

function resetQuiz(ch) {
  const container = getContainer(ch);
  if (!container) return;
  const key = ANSWER_KEYS[ch];

  container.querySelectorAll('input[type=radio]').forEach(r => {
    r.checked = false;
    r.disabled = false;
    r.closest('label').classList.remove('correct', 'wrong', 'selected');
  });

  const banner = document.getElementById('result' + ch);
  if (banner) banner.classList.remove('show');

  const scoreBadge = document.getElementById('score' + ch);
  if (scoreBadge) scoreBadge.textContent = 'Score: —';

  const fill = document.getElementById('prog' + ch);
  const label = document.getElementById('prog' + ch + '-text');
  if (fill) fill.style.width = '0%';
  if (label) label.textContent = '0 / ' + key.length;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.option-label').forEach(label => {
    label.addEventListener('click', function() {
      const radio = this.querySelector('input[type="radio"]');
      if (!radio || radio.disabled) return;
      const match = radio.name.match(/^q(\d+)_/);
      if (!match) return;
      const ch = match[1];
      const container = getContainer(ch);
      if (container) {
        container.querySelectorAll('input[name="' + radio.name + '"]').forEach(r => {
          r.closest('label').classList.remove('selected');
        });
      }
      this.classList.add('selected');
      updateProgress(ch);
    });
  });
});

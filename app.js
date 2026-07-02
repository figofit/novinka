const searchInput = document.querySelector('#searchInput');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const cards = Array.from(document.querySelectorAll('.exercise-card'));
const count = document.querySelector('#visibleCount');
const empty = document.querySelector('#emptyState');
let currentFilter = 'ALL';

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function updateLibrary() {
  const query = normalize(searchInput?.value || '');
  let visible = 0;

  cards.forEach((card) => {
    const haystack = normalize(card.innerText + ' ' + (card.dataset.tags || '') + ' ' + card.dataset.pattern);
    const matchesSearch = !query || haystack.includes(query);
    const matchesFilter = currentFilter === 'ALL' || card.dataset.pattern === currentFilter;
    const show = matchesSearch && matchesFilter;
    card.hidden = !show;
    if (show) visible += 1;
  });

  if (count) count.textContent = `${visible} / ${cards.length} cviků`;
  empty?.classList.toggle('show', visible === 0);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    updateLibrary();
  });
});

searchInput?.addEventListener('input', updateLibrary);
updateLibrary();

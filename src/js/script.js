const data = {};

const eventList = JSON.parse(localStorage.getItem('events')) || [];

// Local data
data.local = {};
data.local.week = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
data.local.months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
data.local.monthsList = function() {
  return this.months.map(month => month.toLowerCase());
};
data.currentDate = {
  month: new Date().getMonth(),
  year: new Date().getFullYear()
};

const createElement = (el, cls, txt = null) => {
  const element = document.createElement(el);
  if (cls) element.className = cls;
  if (txt) element.textContent = txt;
  return element;
};

const displayDate = () => {
  const currentDate = document.getElementById('current');

  currentDate.textContent = `${data.local.months[data.currentDate.month]} ${
    data.currentDate.year
  }`;
};

const displaySearchResult = (style = { display: 'none' }, html = '') => {
  const searchResult = document.getElementById('results');

  searchResult.innerHTML = html;
  searchResult.style = { ...style };
};

window.onload = () => {
  const page = document.getElementById('page');

  displayDate();

  document.getElementById('add').addEventListener('mousedown', () => {
    const addForm = createElement('div', 'add-form');
    page.appendChild(addForm);
    const closeForm = createElement('span', 'btn-close');
    closeForm.addEventListener('mousedown', () => {
      page.removeChild(addForm);
    });
  });

  document.getElementById('update').addEventListener('mousedown', () => {
    location.href = location.href;
  });

  document.getElementById('next').addEventListener('mousedown', () => {
    data.currentDate.month =
      data.currentDate.month > 10 ? 0 : ++data.currentDate.month;
    if (!data.currentDate.month) data.currentDate.year++;
    displayDate();
  });

  document.getElementById('prev').addEventListener('mousedown', () => {
    data.currentDate.month = !data.currentDate.month
      ? 11
      : --data.currentDate.month;
    if (data.currentDate.month === 11) data.currentDate.year--;
    displayDate();
  });

  document.getElementById('today').addEventListener('mousedown', () => {
    data.currentDate = {
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
    displayDate();
  });

  document.getElementById('search').addEventListener('keyup', e => {
    const query = e.target.value;
    const events = _transformEventsList(eventList);

    const filterEvents = events.filter(event => e.toLowerCase().include(query));

    const resultList = filterEvents.join('<br/>');

    if (filterEvents.length || query) {
      displaySearchResult({ display: block }, resultList);
    } else {
      displaySearchResult();
    }
  });
};

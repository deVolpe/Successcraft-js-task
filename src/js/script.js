const data = {};

var events = JSON.parse(localStorage.getItem('events')) || [];

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
  if (txt) element.textContent = txt;
  if (cls) element.className = cls;
  return element;
};

window.onload = () => {
  const currentDate = document.getElementById('current');
  currentDate.textContent = `${data.local.months[data.currentDate.month]} ${
    data.currentDate.year
  }`;
  document.getElementById('add').addEventListener('mousedown', e => {
    const addForm = createElement('div', null, 'add-form');
  });
};

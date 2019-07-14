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

// data

data.currentDate = {
  month: new Date().getMonth(),
  year: new Date().getFullYear()
};

data.DAY = 86400 * 1000;
data.isDialog = false;

const createElement = (el, cls, ch = null) => {
  const element = document.createElement(el);
  if (cls) element.className = cls;
  if (ch) element.innerHTML = ch;
  return element;
};

const displayDate = () => {
  const currentDate = document.getElementById('current');

  currentDate.textContent = `${data.local.months[data.currentDate.month]} ${
    data.currentDate.year
  }`;
};

const displaySearchResult = (style = { display: 'none' }, txt) => {
  const searchResult = document.getElementById('results');

  searchResult.innerHTML = txt;
  searchResult.style.display = style.display;
};

const getFirstDayMonth = (year, month) => {
  const firstDay = new Date(year, month, 1, 0, 0, 0, 0);
  return firstDay.getDay();
};

const hasClass = (el, cls) => el.className.includes(cls);

window.onload = () => {
  const managePanel = document.getElementById('manage-panel');

  displayDate();

  document.getElementById('add').addEventListener('click', () => {
    if (!data.isDialog) {
      data.isDialog = true;
      return;
    }
    const addForm = createElement('div', 'add-form');
    managePanel.appendChild(addForm);

    const close = createElement('span', 'btn-close', 'x');
    const btnCreate = createElement('button', 'btn-add', 'Create');
    const inputAdd = createElement('input');
    inputAdd.setAttribute('placeholder', 'March 5, 2.00 pm, Birthday');
    btnCreate.addEventListener('click', () => {
      if (!inputAdd.value) return;
      const data = inputAdd.value.split(',');
      const id = new Date().getTime();
      const newEvent = {};
      newEvent.id = id;
      newEvent.event = data[0].trim();
      newEvent.date = data[1].trim();
      newEvent.description = data[2].trim();
      newEvent.participants = 'No info';
      eventList.push(newEvent);
      localStorage.events = JSON.stringify(eventList);
      data.isDialog = false;
      managePanel.removeChild(addForm);
    });
    close.addEventListener('click', () => {
      managePanel.removeChild(addForm);
    });
    addForm.appendChild(close);
    addForm.appendChild(inputAdd);
    addForm.appendChild(btnCreate);
  });

  document.getElementById('update').addEventListener('click', () => {
    location.href = location.href;
  });

  document.getElementById('next').addEventListener('click', () => {
    data.currentDate.month =
      data.currentDate.month > 10 ? 0 : ++data.currentDate.month;
    if (!data.currentDate.month) data.currentDate.year++;
    displayDate();
  });

  document.getElementById('prev').addEventListener('click', () => {
    data.currentDate.month = !data.currentDate.month
      ? 11
      : --data.currentDate.month;
    if (data.currentDate.month === 11) data.currentDate.year--;
    displayDate();
  });

  document.getElementById('today').addEventListener('click', () => {
    data.currentDate = {
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
    displayDate();
  });

  document.getElementById('search').addEventListener('keyup', e => {
    const query = e.target.value;
    const events = eventList.map(data => {
      return `${data.event}<br/>${data.date}`;
    });

    const filterEvents = events.filter(event =>
      event.toLowerCase().includes(query)
    );

    const resultList = filterEvents.join('<br/><hr/>');

    if (filterEvents.length || query) {
      displaySearchResult({ display: 'block' }, resultList);
    } else {
      displaySearchResult();
    }
  });
  renderCalendar();
};

function renderCalendar() {
  const months = [];
  let aDay;

  const container = document.getElementById('table', '');
  container.innerHTML = '';

  const table = createElement('table', '');
  container.appendChild(table);
  const tbody = createElement('tbody', '');
  table.appendChild(tbody);

  const fDay = getFirstDayMonth(data.currentDate.year, data.currentDate.month);
  const fDayTS = new Date(
    data.currentDate.year,
    data.currentDate.month,
    1
  ).getTime();

  aDay = fDayTS - data.DAY * (fDay - 1);

  for (let row = 0; row < 5; row++) {
    const tr = createElement('tr', '');
    tbody.appendChild(tr);
    for (let col = 0; col < 7; col++) {
      if (!row) {
        var td = createElement(
          'td',
          '',
          data.local.week[col] + ', ' + new Date(aDay).getDate()
        );
      } else {
        if (row && !col) {
          months[0] = new Date(aDay).getMonth() + 1;
        } else if (row === data.rowTotal - 1 && col === 6) {
          months[1] = new Date(aDay).getMonth() + 1;
          if (months[0] === months[1]) {
            months.pop();
          }
        }
        td = createElement('td', '', new Date(aDay).getDate());
      }
      if (aDay < Date.now() - data.DAY) {
        td.className = 'last';
      }
      eventList.forEach(event => {
        if (!!event && +event.id === aDay) {
          td.className = 'active';
          if (aDay < Date.now() - data.DAY) {
            td.className = 'last active';
          }
          td.innerHTML +=
            '<br/><b>' +
            event.event +
            '</b><br/>' +
            event.date +
            '<br/>' +
            event.names +
            '<br/>' +
            event.description +
            '<br/>';
        }
      });

      td.setAttribute('data-day', aDay);
      td.addEventListener('mousedown', function(e) {
        const el = e.target;
        if (hasClass(el, 'active') || hasClass(el, 'last active')) {
          el.className = 'active edit';
          const id = +el.getAttribute('data-day');
          let data;
          eventList.forEach(event => {
            if (event && event.id === id) {
              data = event;
            }
          });
          const wrap = createElement('div', 'add-form-edit');
          document.getElementById('table').appendChild(wrap);
          wrap.style.left = this.offsetLeft + 130 + 'px';
          wrap.style.top = this.offsetTop - 20 + 'px';

          const close = createElement('span', 'btn-close', 'x');
          close.addEventListener('click', e => {
            el.className = 'active';
            wrap.parentNode.removeChild(wrap);
          });
          const btnClean = createElement('button', 'btn-clean', 'Erase');
          btnClean.addEventListener('click', () => {
            wrap.parentNode.removeChild(wrap);
            el.innerHTML = new Date(data.id).getDate();
            el.removeAttribute('class');

            eventList.forEach((event, i) => {
              if (!!event && data.id === event.id) {
                eventList.splice(i, 1);
              }
            });
            localStorage.setItem('events', JSON.stringify(eventList));
          });

          const fieldEvent = createElement('h3', '', data.event);
          const fieldDate = createElement('p', '', data.date);
          const fieldName = createElement('p', '', data.names);

          const fieldDescription = createElement('textarea', '');
          fieldDescription.value = data.description;

          const btn = createElement('button', 'btn-add', 'Add');
          btn.addEventListener('click', () => {
            data.description = fieldDescription.value;
            el.className = 'active';
            el.innerHTML =
              new Date(id).getDate() +
              '<br/><b>' +
              data.event +
              '</b><br/>' +
              data.date +
              '<br/>' +
              data.names +
              '<br/>' +
              data.description +
              '<br/>';
            eventList.forEach((event, i) => {
              if (!!event && data.id == event.id) {
                eventList[i] = data;
              }
            });
            localStorage.setItem('events', JSON.stringify(eventList));
            wrap.parentNode.removeChild(wrap);
          });
          wrap.appendChild(close);
          wrap.appendChild(fieldEvent);
          wrap.appendChild(fieldDate);
          wrap.appendChild(fieldName);
          wrap.appendChild(fieldDescription);
          wrap.appendChild(btn);
          wrap.appendChild(btnClean);
        } else {
          if (hasClass(el, 'last')) {
            data.isDialog = false;
            return;
          }
          const wrap = createElement('div', 'add-form-advanced');
          document.getElementById('table').appendChild(wrap);
          wrap.style.left = this.offsetLeft + 130 + 'px';
          wrap.style.top = this.offsetTop - 20 + 'px';

          const close = createElement('span', 'btn-close', 'x');
          close.addEventListener('click', () => {
            wrap.parentNode.removeChild(wrap);
          });

          const btnDone = createElement('button', 'btn-add', 'Done');
          const btnClean = createElement('button', '', 'Erase');
          const fieldId = createElement('input', '');
          fieldId.setAttribute('type', 'hidden');
          fieldId.value = el.getAttribute('data-day');

          const fieldEvent = createElement('input', 'field-add');
          fieldEvent.setAttribute('placeholder', 'Event');

          const fieldDate = createElement('input', 'field-date');
          fieldDate.setAttribute('placeholder', 'Time');

          const fieldName = createElement('input', 'field-name');
          fieldName.setAttribute('placeholder', 'Participants names');

          const fieldDescription = createElement(
            'textarea',
            'field-description'
          );
          fieldDescription.setAttribute('placeholder', 'Description');

          btnDone.addEventListener('click', () => {
            if (!data.isDialog) return;
            const event = {
              id: +fieldId.value,
              event: fieldEvent.value,
              date: fieldDate.value,
              names: fieldName.value,
              description: fieldDescription.value
            };
            data.isDialog = false;
            eventList.push(event);
            localStorage.setItem('events', JSON.stringify(eventList));
            wrap.parentNode.removeChild(wrap);
            _renderTable();
          });

          wrap.appendChild(close);
          wrap.appendChild(fieldEvent);
          wrap.appendChild(fieldDate);
          wrap.appendChild(fieldName);
          wrap.appendChild(fieldDescription);
          wrap.appendChild(btnDone);
          wrap.appendChild(btnClean);
        }
      });
      tr.appendChild(td);
      aDay += data.DAY;
    }
  }
}

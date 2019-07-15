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

const toggleDialog = () => {
  if (data.isDialog) return true;
  data.isDialog = true;
  return false;
};

window.onload = () => {
  const managePanel = document.getElementById('manage-panel');

  displayDate();

  document.getElementById('add').addEventListener('click', () => {
    if (toggleDialog()) {
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
      data.isDialog = false;
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
    renderCalendar();
  });

  document.getElementById('prev').addEventListener('click', () => {
    data.currentDate.month = !data.currentDate.month
      ? 11
      : --data.currentDate.month;
    if (data.currentDate.month === 11) data.currentDate.year--;
    displayDate();
    renderCalendar();
  });

  document.getElementById('today').addEventListener('click', () => {
    data.currentDate = {
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    };
    displayDate();
    renderCalendar();
  });

  document.getElementById('search').addEventListener('keyup', e => {
    const query = e.target.value.toLowerCase();
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
    displayDate();
    renderCalendar();
  });
  renderCalendar();
};

function renderCalendar() {
  const months = [];
  let eventDay;

  const container = document.getElementById('table', '', '');
  container.innerHTML = '';

  const table = createElement('table', '');
  container.appendChild(table);
  const tbody = createElement('tbody', '');
  table.appendChild(tbody);

  const firstDay = getFirstDayMonth(
    data.currentDate.year,
    data.currentDate.month
  );
  const firstDayTieSeconds = new Date(
    data.currentDate.year,
    data.currentDate.month,
    1
  ).getTime();

  eventDay = firstDayTieSeconds - data.DAY * (firstDay - 1);

  for (let row = 0; row < 5; row++) {
    const tr = createElement('tr', '');
    tbody.appendChild(tr);
    for (let col = 0; col < 7; col++) {
      if (!row) {
        var td = createElement(
          'td',
          '',
          `${data.local.week[col]}, ${new Date(eventDay).getDate()}`
        );
      } else {
        if (row && !col) {
          months[0] = new Date(eventDay).getMonth() + 1;
        } else if (row === data.rowTotal - 1 && col === 6) {
          months[1] = new Date(eventDay).getMonth() + 1;
          if (months[0] === months[1]) {
            months.pop();
          }
        }
        td = createElement('td', '', new Date(eventDay).getDate());
      }
      if (eventDay < Date.now() - data.DAY) {
        td.className = 'last';
      }
      eventList.forEach(event => {
        if (!!event && +event.id === eventDay) {
          td.className = 'active';
          if (eventDay < Date.now() - data.DAY) {
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

      td.setAttribute('data-day', eventDay);
      td.addEventListener('click', e => {
        if (toggleDialog()) {
          return;
        }
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
          const editForm = createElement('div', 'add-form-edit');
          document.getElementById('table').appendChild(editForm);
          editForm.style.left = e.target.offsetLeft + 170 + 'px';
          editForm.style.top = e.target.offsetTop - 30 + 'px';

          const close = createElement('span', 'btn-close', 'x');
          close.addEventListener('click', () => {
            data.isDialog = false;
            el.className = 'active';
            editForm.parentNode.removeChild(editForm);
          });
          const btnErase = createElement('button', 'btn', 'Erase');
          btnErase.addEventListener('click', () => {
            data.isDialog = false;
            editForm.parentNode.removeChild(editForm);
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

          const btnAdd = createElement('button', 'btn', 'Add');
          btnAdd.addEventListener('click', () => {
            data.isDialog = false;
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
            editForm.parentNode.removeChild(editForm);
          });
          editForm.appendChild(close);
          editForm.appendChild(fieldEvent);
          editForm.appendChild(fieldDate);
          editForm.appendChild(fieldName);
          editForm.appendChild(fieldDescription);
          editForm.appendChild(btnAdd);
          editForm.appendChild(btnErase);
        } else {
          if (hasClass(el, 'last')) {
            data.isDialog = false;
            return;
          }
          const advancedFormLast = createElement('div', 'add-form-advanced');
          document.getElementById('table').appendChild(advancedFormLast);
          advancedFormLast.style.left = e.target.offsetLeft + 170 + 'px';
          advancedFormLast.style.top = e.target.offsetTop - 30 + 'px';

          const close = createElement('span', 'btn-close', 'x');
          close.addEventListener('click', () => {
            data.isDialog = false;
            advancedFormLast.parentNode.removeChild(advancedFormLast);
          });

          const btnDone = createElement('button', 'btn', 'Done');
          const btnErase = createElement('button', 'btn', 'Erase');
          const fieldId = createElement('input', '');
          fieldId.setAttribute('type', 'hidden');
          fieldId.value = el.getAttribute('data-day');

          const fieldEvent = createElement('input', '');
          fieldEvent.setAttribute('placeholder', 'Event');

          const fieldDate = createElement('input', '');
          fieldDate.setAttribute('placeholder', 'Time');

          const fieldName = createElement('input', '');
          fieldName.setAttribute('placeholder', 'Participants names');

          const fieldDescription = createElement('textarea', '');
          fieldDescription.setAttribute('placeholder', 'Description');

          btnDone.addEventListener('click', () => {
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
            advancedFormLast.parentNode.removeChild(advancedFormLast);
            renderCalendar();
          });

          advancedFormLast.appendChild(close);
          advancedFormLast.appendChild(fieldEvent);
          advancedFormLast.appendChild(fieldDate);
          advancedFormLast.appendChild(fieldName);
          advancedFormLast.appendChild(fieldDescription);
          advancedFormLast.appendChild(btnDone);
          advancedFormLast.appendChild(btnErase);
        }
      });
      tr.appendChild(td);
      eventDay += data.DAY;
    }
  }
}

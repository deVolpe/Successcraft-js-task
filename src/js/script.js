const data = {};

const eventList = JSON.parse(localStorage.events || '[]');

// Local data
data.local = {};
data.local.days = [
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

data.local.monthList = function() {
  return this.months.map(m => m.toLowerCase());
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
  const firstDay = new Date(year, month, 1);
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
  const searchPanel = document.getElementById('search-panel');

  const { monthList } = data.local;
  const { year } = data.currentDate;

  displayDate();

  document.getElementById('add').addEventListener('click', () => {
    if (toggleDialog()) return;
    const addForm = createElement('div', 'add-form');
    managePanel.appendChild(addForm);

    const close = createElement('span', 'btn-close');
    const btnCreate = createElement('button', 'btn btn-add', 'Create');
    const inputAdd = createElement('input');
    inputAdd.setAttribute('placeholder', 'March 5, 2.00 pm, Birthday');
    btnCreate.addEventListener('click', () => {
      const res = inputAdd.value.split(',');
      if (!res.length || res.length < 3) return;
      const _day = +res[0].split(' ')[1].trim();
      const _month = monthList.call(data.local).indexOf(
        res[0]
          .split(' ')[0]
          .trim()
          .toLowerCase()
      );
      const id = new Date(year, _month, _day).getTime();
      const newEvent = {};
      newEvent.id = id;
      newEvent.event = res[0].trim();
      newEvent.date = res[1].trim();
      newEvent.description = res[2].trim();
      newEvent.participants = 'No info';

      eventList.push(newEvent);
      localStorage.events = JSON.stringify(eventList) || '[]';
      data.isDialog = false;
      managePanel.removeChild(addForm);
      renderCalendar();
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

  // Search DropList
  document.getElementById('search').addEventListener('keyup', e => {
    const query = e.target.value.toLowerCase();
    const events = eventList.map(ev => `${ev.event}<br/>${ev.date}`);

    const filterEvents = events.filter(ev => ev.toLowerCase().includes(query));

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
  const container = document.getElementById('table', '');
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

  const months = [];
  let eventDay = firstDayTieSeconds - data.DAY * (firstDay - 1);

  let td;

  for (let row = 0; row < 5; row++) {
    const tr = createElement('tr', '');
    tbody.appendChild(tr);
    for (let col = 0; col < 7; col++) {
      if (!row) {
        td = createElement(
          'td',
          '',
          `${data.local.days[col]}, ${new Date(eventDay).getDate()}`
        );
      } else {
        if (row && !col) {
          months[0] = new Date(eventDay).getMonth() + 1;
        } else if (row === data.rowTotal - 1 && col === 6) {
          months[1] = new Date(eventDay).getMonth() + 1;
          if (months[0] === months[1]) months.pop();
        }
        td = createElement('td', '', new Date(eventDay).getDate());
      }
      if (eventDay < Date.now() - data.DAY) {
        td.className = 'last';
      }
      eventList.forEach(ev => {
        if (+ev.id === eventDay) {
          td.className = 'active';
          if (eventDay < Date.now() - data.DAY) {
            td.className = 'last active';
          }
          td.innerHTML +=
            '<br/><b>' +
            ev.event +
            '</b><br/>' +
            ev.date +
            '<br/>' +
            ev.participants +
            '<br/>' +
            ev.description +
            '<br/>';
        }
      });

      td.setAttribute('data-day', eventDay);
      td.addEventListener('click', e => {
        if (toggleDialog()) return;
        const el = e.target;
        if (hasClass(el, 'active') || hasClass(el, 'last active')) {
          el.className = 'active edit';
          const id = +el.getAttribute('data-day');
          const event = eventList.filter(ev => ev.id === id)[0];
          const editForm = createElement('div', 'add-form-edit');
          container.appendChild(editForm);
          editForm.style.left = `${e.target.offsetLeft + 170}px`;
          editForm.style.top = `${e.target.offsetTop - 30}px`;

          const close = createElement('span', 'btn-close');
          close.addEventListener('click', () => {
            data.isDialog = false;
            el.className = 'active';
            container.removeChild(editForm);
          });
          const btnClean = createElement('button', 'btn btn-clean', 'Clean');
          btnClean.addEventListener('click', () => {
            data.isDialog = false;
            container.removeChild(editForm);
            el.innerHTML = new Date(event.id).getDate();
            el.removeAttribute('class');

            const _eventList = eventList.filter(ev => event.id !== ev.id);

            localStorage.events = JSON.stringify(_eventList) || '[]';
          });

          const fieldEvent = createElement('h3', '', event.event);
          const fieldDate = createElement('p', '', event.date);
          const fieldNames = createElement(
            'p',
            '',
            `Participants:<br/>${event.participants}`
          );

          const fieldDescription = createElement(
            'textarea',
            '',
            event.description
          );

          const btnAdd = createElement('button', 'btn btn-add', 'Edit');
          btnAdd.addEventListener('click', () => {
            data.isDialog = false;
            event.description = fieldDescription.value;
            el.className = 'active';
            el.innerHTML =
              new Date(id).getDate() +
              '<br/><b>' +
              event.event +
              '</b><br/>' +
              event.date +
              '<br/>' +
              event.participants +
              '<br/>' +
              event.description +
              '<br/>';
            eventList.forEach((ev, i) => {
              if (ev.id === event.id) eventList[i] = event;
            });
            localStorage.events = JSON.stringify(eventList) || '[]';
            container.removeChild(editForm);
          });
          editForm.appendChild(close);
          editForm.appendChild(fieldEvent);
          editForm.appendChild(fieldDate);
          editForm.appendChild(fieldNames);
          editForm.appendChild(fieldDescription);
          editForm.appendChild(btnAdd);
          editForm.appendChild(btnClean);
        } else {
          if (hasClass(el, 'last')) {
            data.isDialog = false;
            return;
          }
          const advancedFormLast = createElement('div', 'add-form-advanced');
          container.appendChild(advancedFormLast);
          advancedFormLast.style.left = e.target.offsetLeft + 170 + 'px';
          advancedFormLast.style.top = e.target.offsetTop - 30 + 'px';

          const close = createElement('span', 'btn-close');
          close.addEventListener('click', () => {
            data.isDialog = false;
            advancedFormLast.parentNode.removeChild(advancedFormLast);
          });

          const btnDone = createElement('button', 'btn btn-add', 'Done');
          const btnClean = createElement('button', 'btn btn-clean', 'Clean');
          const fieldId = createElement('input', '');
          fieldId.setAttribute('type', 'hidden');
          fieldId.value = el.getAttribute('data-day');

          const fieldEvent = createElement('input', '');
          fieldEvent.setAttribute('placeholder', 'Event');

          const fieldDate = createElement('input', '');
          fieldDate.setAttribute('placeholder', 'Time');

          const fieldNames = createElement('input', '');
          fieldNames.setAttribute('placeholder', 'Names of participants');

          const fieldDescription = createElement('textarea', '');
          fieldDescription.setAttribute('placeholder', 'Description');

          btnDone.addEventListener('click', () => {
            const event = {
              id: +fieldId.value,
              event: fieldEvent.value,
              date: fieldDate.value,
              participants: fieldNames.value,
              description: fieldDescription.value
            };
            data.isDialog = false;
            eventList.push(event);
            localStorage.events = JSON.stringify(eventList) || '[]';
            container.removeChild(advancedFormLast);
            renderCalendar();
          });

          advancedFormLast.appendChild(close);
          advancedFormLast.appendChild(fieldEvent);
          advancedFormLast.appendChild(fieldDate);
          advancedFormLast.appendChild(fieldNames);
          advancedFormLast.appendChild(fieldDescription);
          advancedFormLast.appendChild(btnDone);
          advancedFormLast.appendChild(btnClean);
        }
      });
      tr.appendChild(td);
      eventDay += data.DAY;
    }
  }
}

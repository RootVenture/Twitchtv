const streamers = [
  'ESL_SC2',
  'OgamingSC2',
  'cretetion',
  'freecodecamp',
  'storbeck',
  'habathcx',
  'RobotCaleb',
  'noobs2ninjas',
  'DrDisRespectLIVE'
];
const onlineUsers = [];
const offlineUsers = [];

const all = document.querySelector('.all');
const offline = document.querySelector('.offline');
const online = document.querySelector('.online');
const result = document.querySelector('.row');
const triggers = document.querySelectorAll('.tabs > li');
// const arrow = document.querySelector('.arrow');
const background = document.querySelector('.dropdownBackground');
const nav = document.querySelector('.top');
const addBtn = document.querySelector('#add-button');
const addStream = document.querySelector('#add-stream');
const label = document.querySelector('label');
const inputGrp = document.querySelector('#input-group');

// animate fab on click
addBtn.addEventListener('click', e => {
  if (addBtn.classList.contains('clicked') && inputGrp.classList.contains('visible')) {
    addBtn.classList.remove('clicked');
    inputGrp.classList.remove('visible');
  } else {
    addBtn.classList.add('clicked');
    inputGrp.classList.add('visible');
  }
  addStream.value = '';
});

// animate fab on blur
addStream.addEventListener('blur', e => {
  addStream.value = '';
  if (inputGrp.classList.contains('visible') && addBtn.classList.contains('clicked')) {
    inputGrp.classList.remove('visible');
    addBtn.classList.remove('clicked');
  } else {
    inputGrp.classList.add('visible');
    addBtn.classList.add('clicked');
  }
});

// animate input label and give input focus on click
label.addEventListener('click', e => {
  addStream.focus();
});

addStream.addEventListener('keypress', e => {
  if (e.which === 13) {
    // store search terms
    const userSearch = addStream.value;
    addStream.value = '';
    // prevent page reload
    e.preventDefault();
    addStream.blur();
    if (streamers.includes(userSearch)) {
      console.log('duplicate');
      return false;
    }
    streamers.push(userSearch);
    const isUser = checkAdd(userSearch);
    console.log(isUser);
    if (isUser) {
      populateAll(streamers);
    } else {
      return false;
    }
  }
});

function generateOnlineCards(user) {
  result.insertAdjacentHTML(
    'beforeend',
    `
    <div class="card onlineStream">

      <img src="${user.stream.channel.logo}" alt="Users Logo"/>
      <div class="card__header">
          <p class="stream__name">${user.stream.channel.name}</p>
          <p class="stream__viewers">${user.stream.viewers} viewers</p>
          <div class="card__content">
              <p>${user.stream.channel.status !== null ? user.stream.channel.status : 'OFFLINE'}</p>
          </div>
          <button class="view"><a href="https://twitch.tv/${
            user.stream.channel.name
          }" target="_blank" rel="noopener">VIEW</a></button>
      </div>

    </div>
  `
  );
}

function generateOfflineCards(user) {
  result.insertAdjacentHTML(
    'beforeend',
    `
    <div class="card offlineStream">

      <img src="${user.logo}" alt="Users Logo"/>
      <div class="card__header">
        <p class="stream__name">${user.name}</p>
          <p class="stream__viewers">0 viewers</p>
        <div class="card__content">
        <p>Stream is Offline</p>
      </div>
      <button class="view"><a href="https://twitch.tv/${user.name}" target="_blank" rel="noopener">VIEW</a></button>
    </div>

    </div>
  `
  );
}

function isOffline(user) {
  const userApi = 'https://wind-bow.glitch.me/twitch-api/users/';
  fetch(`${userApi}${user}`)
    .then(response => response.json())
    .then(data => generateOfflineCards(data))
    .catch(err => console.error(err));
}

function isOnline(user) {
  const streamApi = 'https://wind-bow.glitch.me/twitch-api/streams/';
  const endpoint = `${streamApi}${user}`;
  fetch(endpoint)
    .then(response => response.json())
    .then(data => generateOnlineCards(data))
    .catch(err => console.error(err));
}

function populateAll(users) {
  result.innerHTML = '';
  const streamApi = 'https://wind-bow.glitch.me/twitch-api/streams/';
  users.forEach(user => {
    const endpoint = `${streamApi}${user}`;
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        if (data.stream != null) {
          onlineUsers.push(data.stream.channel.name);
          generateOnlineCards(data);
        } else {
          console.log(data);
          offlineUsers.push(user);
          isOffline(user);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });
}

async function checkAdd(user) {
  const streamApi = 'https://wind-bow.glitch.me/twitch-api/streams/';
  const endpoint = `${streamApi}${user}`;
  await fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      if (data.stream) {
        console.log(data);
        return true;
      } else if (data.error) {
        console.log(data.error);
        return false;
      }
    })
    .catch(err => {
      console.error(err);
    });
}
// vanilla JS document ready
document.addEventListener('DOMContentLoaded', () => {
  populateAll(streamers);
});

function filterOff() {
  all.classList.add('active');
  offline.classList.remove('active');
  online.classList.remove('active');
  populateAll(streamers);
}

function filterOnline() {
  result.innerHTML = '';
  online.classList.add('active');
  offline.classList.remove('active');
  all.classList.remove('active');
  onlineUsers.forEach(user => {
    isOnline(user);
  });
}

function filterOffline() {
  result.innerHTML = '';
  offlineUsers.forEach(user => {
    isOffline(user);
  });
}

function handleEnter() {
  this.childNodes[1].style.backgroundColor = 'orange';
  const dropdown = this.querySelector('.dropdown');
  const dropdownCoords = dropdown.getBoundingClientRect();
  const navCoords = nav.getBoundingClientRect();
  // console.log(navCoords);
  background.classList.add('open');
  // need to offset the dropdown by the nav size
  const coords = {
    // height: dropdownCoords.height,
    // width: dropdownCoords.width,
    top: dropdownCoords.top - navCoords.top + 30,
    left: dropdownCoords.left - navCoords.left - 40,
  };

  // background.style.setProperty("width", `${coords.width}px`);
  // background.style.setProperty('height', `${coords.height}px`);
  background.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px`);
}

function handleLeave() {
  background.classList.remove('open');
  this.childNodes[1].style.background = 'rgba(0, 0, 0, 0.2)';
}

all.addEventListener('click', filterOff);
online.addEventListener('click', filterOnline);
offline.addEventListener('click', filterOffline);
triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));

const streamers = [
  'ESL_SC2',
  'OgamingSC2',
  'cretetion',
  'freecodecamp',
  'storbeck',
  'habathcx',
  'RobotCaleb',
  'noobs2ninjas',
];
const onlineUsers = [];
const offlineUsers = [];

const all = document.querySelector('.all');
const offline = document.querySelector('.offline');
const online = document.querySelector('.online');
const result = document.querySelector('.row');
const triggers = document.querySelectorAll('.tabs > li');
const arrow = document.querySelector('.arrow');
const background = document.querySelector('.dropdownBackground');
const nav = document.querySelector('.top');

function generateOnlineCards(user) {
  result.insertAdjacentHTML(
    'beforeend',
    `
    <div class="card online">
        <div class="card__header">
          <a href="https://twitch.tv/${user.stream.channel.name}" target="_blank" rel="noopener">${
      user.stream.channel.name
    }</a>
            <img src="${user.stream.channel.logo}" alt="Users Logo"/>
          <div class="card__content">
              <p>${user.stream.channel.status !== null ? user.stream.channel.status : 'OFFLINE'}</p>
          </div>
      </div>
    </div>
  `
  );
}

function generateOfflineCards(user) {
  result.insertAdjacentHTML(
    'beforeend',
    `
    <div class="card offline">
        <div class="card__header">
          <a href="https://twitch.tv/${user.name}" target="_blank" rel="noopener">${user.name}</a>
            <img src="${user.logo}" alt="Users Logo"/>
          <div class="card__content">
              <p>OFFLINE</p>
          </div>
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
          offlineUsers.push(user);
          isOffline(user);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });
}

// vanilla JS document ready
document.addEventListener('DOMContentLoaded', () => {
  populateAll(streamers);
});

function filterOff() {
  populateAll(streamers);
}

function filterOnline() {
  result.innerHTML = '';
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
  this.childNodes[1].style.backgroundColor = '#3ecf8e';
  const dropdown = this.querySelector('.dropdown');
  const dropdownCoords = dropdown.getBoundingClientRect();
  const navCoords = nav.getBoundingClientRect();

  background.classList.add('open');
  // need to offset the dropdown by the nav size
  const coords = {
    height: dropdownCoords.height,
    width: dropdownCoords.width,
    top: dropdownCoords.top - navCoords.top,
    left: dropdownCoords.left - navCoords.left,
  };

  background.style.setProperty('width', `${coords.width}px`);
  background.style.setProperty('height', `${coords.height}px`);
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

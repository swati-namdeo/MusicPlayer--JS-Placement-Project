const audioFile = document.getElementById("audioFile");
const player = document.getElementById("player");
const playbtn = document.getElementById("masterPlay");
const now_playing = document.getElementById("masterSongName");
const track_art = document.getElementById(".track-art");
const track_name = document.querySelector(".track-name");
const track_artist = document.querySelector(".track-artist");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
const next = document.getElementById("next");
const shuffle = document.getElementById("shuffle");
const previous = document.getElementById("previous");
const forwardBtn = document.getElementById("forward");
const backwardBtn = document.getElementById("backward");
const searchSongs = document.getElementById("searchsong");

let previewData;
let music_list = [];
let queue_music = [];
let isRandom = false;
let isplaying = false;
let updateTimer;
let track_index = 0;

//Api fetch

const apiFetch = async () => {
  const result = await fetch(
    "https://api.napster.com/v2.1/tracks/top?apikey=NWM4M2Y5MTctOTdjMC00MWExLTg0ODItZWRhYjI1ODlmOWZm"
  );
  const data = await result.json();
  const list = document.getElementById("music_list");
  const an = document.getElementById("structure");
  music_list = data?.tracks;
  console.log(music_list);
  data?.tracks?.forEach((item, index) => {
    const child = document.createElement("div");
    child.className = "musicListDiv";
    const img = document.createElement("img");
    const songname = document.createElement("h3");
    const arname = document.createElement("h5");
    songname.innerText = item.name;
    arname.innerText = item.artistName;
    child.appendChild(img);
    child.appendChild(songname);
    child.appendChild(arname);
    child.onclick = () => {
      track_index = index;
      now_playing.innerText = item.name;
      audioPlay(item.previewURL);
    };

    an.appendChild(child);
    list.appendChild(child);
  });
  previewData = data.tracks[0].previewURL;
};

//Audio play

const audioPlay = async (url) => {
  clearInterval(updateTimer);
  reset();
  player.src = url;
  player.play();
  playbtn.className = "fa-solid fa-2x fa-pause";
  updateTimer = setInterval(setUpdate, 1000);
  isplaying = true;
  player.addEventListener("ended", nextTrack);
};
function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  // seek_slider.value = 0;
}
const playandpause = () => {
  const playbtn = document.getElementById("masterPlay");
  playbtn.className = !isplaying
    ? "fa-solid fa-2x fa-pause"
    : "fa-solid fa-2x fa-circle-play";
  if (isplaying) player.pause();
  else {
    player.play();
  }
  isplaying = !isplaying;
};
apiFetch();
console.log(previewData);
function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(player.duration)) {
    // seekPosition = player.currentTime * (100 / player.duration);
    // seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(player.currentTime / 60);
    let currentSeconds = Math.floor(player.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(player.duration / 60);
    let durationSeconds = Math.floor(player.duration - durationMinutes * 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

forwardBtn.addEventListener("click", () => {
  player.currentTime += 5;
});

// backward 5 sec
backwardBtn.addEventListener("click", () => {
  player.currentTime -= 5;
});
function nextTrack() {
  if (track_index < music_list.length - 1 && isRandom === false) {
    track_index += 1;
  } else if (track_index < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * music_list.length);
    track_index = random_index;
  } else {
    track_index = 0;
  }
  // loadTrack(track_index);
  now_playing.innerText = music_list[track_index].name;
  audioPlay(music_list[track_index].previewURL);
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1;
  } else {
    track_index = music_list.length - 1;
  }
  now_playing.innerText = music_list[track_index].name;
  audioPlay(music_list[track_index].previewURL);
}
next.onclick = nextTrack;
previous.onclick = prevTrack;

shuffle.onclick = () => {
  isRandom = !isRandom;
  shuffle.className = isRandom
    ? "fa-solid fa-shuffle shuffleon"
    : "fa-solid fa-shuffle";
  let random_index = Number.parseInt(Math.random() * music_list.length);

  if (isRandom) {
    now_playing.innerText = music_list[random_index].name;
    audioPlay(music_list[random_index].previewURL);
  }
};

function addQueue() {
  if (!queue_music.find((item) => item.id == music_list[track_index].id))
    queue_music.push(
      music_list.find((item) => item.id == music_list[track_index].id)
    );
}

function showQueue() {
  var x = document.getElementById("qd");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

  const list = document.getElementById("qd");
  list.innerHTML = "";
  queue_music?.forEach((item, index) => {
    const child = document.createElement("div");
    const img = document.createElement("img");
    const songname = document.createElement("h3");
    const arname = document.createElement("h5");
    songname.innerText = item.name;
    arname.innerText = item.artistName;
    child.appendChild(img);
    child.appendChild(songname);
    child.appendChild(arname);
    child.style.padding='0.5rem'
    child.onclick = () => {
      track_index = index;
      now_playing.innerText = item.name;
      audioPlay(item.previewURL);
    };
    list.appendChild(child);
  });
}

searchSongs.onkeydown = (event) => {
  const inputData = event.target.value.toLowerCase().split(" ").join("");
  const sd = document.getElementById("sd");
  if (inputData) {
    const searchedData = music_list.filter((item) =>
      item.name
        .toLowerCase()
        .split(" ")
        .join("")
        .includes(event.target.value.toLowerCase().split(" ").join(""))
    );

    sd.innerHTML = "";
    searchedData?.forEach((item, index) => {
      const child = document.createElement("div");
      const img = document.createElement("img");
      const songname = document.createElement("h3");
      const arname = document.createElement("h5");
      songname.innerText = item.name;
      arname.innerText = item.artistName;
      child.appendChild(img);
      child.appendChild(songname);
      child.appendChild(arname);
      child.style.padding='0.5rem'
      child.onclick = () => {
        track_index = index;
        now_playing.innerText = item.name;
        audioPlay(item.previewURL);
      };
      // const list = document.getElementById("music_list");
      // an.appendChild(child);
      sd.appendChild(child);
    });
  } else {
    sd.innerHTML = "";
  }
};

const addToPlaylist = () => {
  const currentsong = music_list[track_index];
  if (localStorage) {
    let data = JSON.parse(localStorage.getItem("playlist"));
    console.log(data, "data");
    if (!data) {
      data = [];
    }
    if (!data.find((item) => item.id == currentsong.id)) {
      data.push(currentsong);
      localStorage.setItem("playlist", JSON.stringify(data));
    }
  }
};
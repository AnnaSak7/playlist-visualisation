/*

  Follow the instructions for "Calling the Spotify playlist API" and
  "Rendering a playlist visualisation" in the README

*/

function getAccessToken() {
  const hash = window.location.hash;
  const hashWithoutHash = hash.substring(1);

  const params = hashWithoutHash.split('&');
  const keyValues = params.map((param) => param.split('='));

  const accessToken = keyValues[0][1];
  return accessToken;
}

function getPlaylist(playlistId) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  };

  return fetch(url, { headers }).then((response) => response.json());
}

// curl -X "GET" "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n?market=ES" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQB17fqDeuOYYhdXyKhxuIHxbI_6Wi2y8Y_Fm3KzFhs5lj_uPfG781P7gOGwja3fKY4-Qp_uUgNkXzJ2QeLMMQb3rZ7dN5O5jbzgIxyV0mQamFhW7HWpsMt5deoTQt_UuBiVvnQMk-A"

function renderPlaylist(playlistId) {
  //   <div class="playlist-item">
  //   <img class="playlist-item-img" src="IMG_URL" />
  //   <div class="playlist-item-title">SONG_TITLE</div>
  // </div>

  const container = document.getElementById('tracks');
  const audioPlayer = document.getElementById('player');

  getPlaylist(playlistId).then((playlist) => {
    const tracks = playlist.tracks.items;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i].track;

      const playlistItem = document.createElement('div');
      playlistItem.classList.add('playlist-item');

      const playlistItemImg = document.createElement('img');
      playlistItemImg.classList.add('playlist-item-img');
      playlistItemImg.setAttribute('src', track.album.images[0].url);

      const playlistItemTitle = document.createElement('div');
      playlistItemTitle.classList.add('playlist-item-title');
      playlistItemTitle.innerHTML = track.name;

      playlistItem.addEventListener('click', () => {
        if (currentlyActive === track.id) {
          audioPlayer.pause();
          currentlyActive = null;
          playlistItem.classList.remove('active');
        } else {
          if (currentlyActive) {
            document.querySelector('.active').classList.remove('active');
          }
          currentlyActive = track.id;
          playlistItem.classList.add('active');

          // Play preview if available
          if (track.preview_url) {
            audioPlayer.setAttribute('src', track.preview_url);
            audioPlayer.play();
          } else {
            audioPlayer.pause();
          }
        }
      });

      playlistItem.appendChild(playlistItemImg);
      playlistItem.appendChild(playlistItemTitle);
      container.appendChild(playlistItem);
    }
  });
}

let currentlyActive;

renderPlaylist('37i9dQZF1DX4o1oenSJRJd');

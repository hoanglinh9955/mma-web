<template>
    <div class="video-container">
      <video ref="video" @timeupdate="updateTime" @loadedmetadata="setDuration" @click="togglePlayPause">
        <source src="https://1st-store.uk/files/1718303772331-pi5.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="controls" :class="{ 'hide-controls': hideControls }" @mouseover="showControls" @mouseleave="hideControlsTemporarily">
        <div class="progress-bar" @click="seek" :style="{ '--progress': progress + '%' }">
          <div class="progress-bar-filled"></div>
        </div>
        <div class="buttons">
          <button @click="togglePlayPause" class="play-pause">{{ isPlaying ? '❚❚' : '▶️' }}</button>
          <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          <button @click="toggleMute" class="mute">{{ isMuted ? '🔇' : '🔊' }}</button>
          <input type="range" class="volume" min="0" max="1" step="0.1" v-model="volume" @input="setVolume">
          <button @click="toggleFullScreen" class="fullscreen">{{ isFullScreen ? '🡹' : '🡺' }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const video = ref(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const isMuted = ref(false);
  const volume = ref(1);
  const isFullScreen = ref(false);
  const hideControls = ref(false);
  const progress = ref(0);
  
  const togglePlayPause = () => {
    if (video.value.paused) {
      video.value.play();
      isPlaying.value = true;
    } else {
      video.value.pause();
      isPlaying.value = false;
    }
  };
  
  const updateTime = () => {
    currentTime.value = video.value.currentTime;
    progress.value = (video.value.currentTime / video.value.duration) * 100;
  };
  
  const setDuration = () => {
    duration.value = video.value.duration;
  };
  
  const seek = (event) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;
    video.value.currentTime = percentage * video.value.duration;
  };
  
  const toggleMute = () => {
    video.value.muted = !video.value.muted;
    isMuted.value = video.value.muted;
  };
  
  const setVolume = () => {
    video.value.volume = volume.value;
  };
  
  const toggleFullScreen = () => {
    if (!isFullScreen.value) {
      if (video.value.requestFullscreen) {
        video.value.requestFullscreen();
      } else if (video.value.mozRequestFullScreen) { /* Firefox */
        video.value.mozRequestFullScreen();
      } else if (video.value.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        video.value.webkitRequestFullscreen();
      } else if (video.value.msRequestFullscreen) { /* IE/Edge */
        video.value.msRequestFullscreen();
      }
      isFullScreen.value = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
      isFullScreen.value = false;
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  const showControls = () => {
    hideControls.value = false;
  };
  
  const hideControlsTemporarily = () => {
    setTimeout(() => {
      hideControls.value = true;
    }, 3000);
  };
  </script>
  
  <style scoped>
  .video-container {
    position: relative;
    max-width: 640px;
    margin: auto;
    background: black;
  }
  
  video {
    width: 100%;
    display: block;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    transition: opacity 0.5s;
  }
  
  .controls.hide-controls {
    opacity: 0;
  }
  
  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  
  button, input[type="range"] {
    background: none;
    border: none;
    color: inherit;
    padding: 0;
    margin: 0 5px;
    cursor: pointer;
  }
  
  input[type="range"] {
    flex-grow: 1;
  }
  
  button {
    padding: 5px 10px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.3);
  }
  
  button:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  
  .progress-bar {
    width: 100%;
    height: 5px;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .progress-bar-filled {
    height: 100%;
    background: red;
    width: var(--progress, 0%);
    transition: width 0.1s;
  }
  </style>
  
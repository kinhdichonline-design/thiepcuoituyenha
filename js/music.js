/**
 * Wedding Background Music Controller
 * Supports audio streams & fallback Web Audio API romantic melody
 */

(function() {
  let isPlaying = false;
  let audioEl = null;
  let musicBtn = null;
  let webAudioCtx = null;
  let webAudioOsc = null;
  let webAudioGain = null;
  let isUsingWebAudio = false;

  // Initialize
  function initMusic() {
    audioEl = document.getElementById('wedding-audio');
    musicBtn = document.getElementById('music-toggle-btn');

    if (musicBtn) {
      musicBtn.addEventListener('click', toggleMusic);
    }
  }

  // Play music
  function playMusic() {
    if (!audioEl) audioEl = document.getElementById('wedding-audio');
    if (!musicBtn) musicBtn = document.getElementById('music-toggle-btn');

    if (audioEl) {
      audioEl.play().then(() => {
        isPlaying = true;
        updateUI();
      }).catch(err => {
        console.warn('HTML5 Audio autoplay restricted or unavailable, starting Web Audio piano mode:', err.message);
        startWebAudioMelody();
        isPlaying = true;
        updateUI();
      });
    } else {
      startWebAudioMelody();
      isPlaying = true;
      updateUI();
    }
  }

  // Pause music
  function pauseMusic() {
    if (audioEl && !isUsingWebAudio) {
      audioEl.pause();
    }
    if (isUsingWebAudio && webAudioCtx) {
      webAudioCtx.suspend();
    }
    isPlaying = false;
    updateUI();
  }

  // Toggle
  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      if (isUsingWebAudio && webAudioCtx && webAudioCtx.state === 'suspended') {
        webAudioCtx.resume();
        isPlaying = true;
        updateUI();
      } else {
        playMusic();
      }
    }
  }

  function updateUI() {
    if (musicBtn) {
      if (isPlaying) {
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('title', 'Tắt nhạc nền');
      } else {
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('title', 'Bật nhạc nền');
      }
    }
  }

  // Web Audio Romantic Piano/Bell Chords (Offline Fallback)
  function startWebAudioMelody() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!webAudioCtx) {
        webAudioCtx = new AudioContext();
      }
      if (webAudioCtx.state === 'suspended') {
        webAudioCtx.resume();
      }
      isUsingWebAudio = true;

      // Romantic Canon in D Chord progression: D - A - Bm - F#m - G - D - G - A
      const notes = [
        // D Major
        [293.66, 369.99, 440.00],
        // A Major
        [220.00, 277.18, 329.63],
        // B Minor
        [246.94, 293.66, 369.99],
        // F# Minor
        [185.00, 220.00, 277.18],
        // G Major
        [196.00, 246.94, 293.66],
        // D Major
        [146.83, 220.00, 293.66],
        // G Major
        [196.00, 246.94, 293.66],
        // A Major
        [220.00, 277.18, 329.63]
      ];

      let chordIndex = 0;
      function playChord() {
        if (!isPlaying || !isUsingWebAudio) return;
        const currentChord = notes[chordIndex % notes.length];
        const now = webAudioCtx.currentTime;

        currentChord.forEach((freq, idx) => {
          const osc = webAudioCtx.createOscillator();
          const gain = webAudioCtx.createGain();
          
          osc.type = 'triangle'; // Warm soft bell/piano tone
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);

          gain.gain.setValueAtTime(0, now + idx * 0.15);
          gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.15 + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 2.5);

          osc.connect(gain);
          gain.connect(webAudioCtx.destination);

          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 2.6);
        });

        chordIndex++;
        setTimeout(playChord, 1800);
      }

      playChord();
    } catch (e) {
      console.error('Web Audio error:', e);
    }
  }

  // Export globally
  window.playWeddingMusic = playMusic;
  window.pauseWeddingMusic = pauseMusic;
  window.toggleWeddingMusic = toggleMusic;

  document.addEventListener('DOMContentLoaded', initMusic);
})();

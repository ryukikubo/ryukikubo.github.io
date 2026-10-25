var gamef = false;
var bord = new Array(9);
var bord_lifeTime = new Array(9);
var turn = 1;
var winf = false;
var winturn = 0;
var winindex = new Array(3);
var placementSoundIndex = 0;
var placementAudioContext = null;

$(document).ready(function () {
  function playPlacementSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!placementAudioContext) {
      placementAudioContext = new AudioContextClass();
    }
    if (placementAudioContext.state === 'suspended') {
      placementAudioContext.resume().catch(function () {});
    }

    const notes = [932.33, 1046.5, 1174.66, 1244.51, 1396.91];
    const partials = [
      { ratio: 1, level: 0.075, decay: 0.27 },
      { ratio: 2.015, level: 0.022, decay: 0.19 },
      { ratio: 4.03, level: 0.009, decay: 0.13 },
      { ratio: 6.12, level: 0.0035, decay: 0.09 }
    ];
    const now = placementAudioContext.currentTime;
    const note = notes[placementSoundIndex];

    partials.forEach(partial => {
      const oscillator = placementAudioContext.createOscillator();
      const volume = placementAudioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note * partial.ratio, now);
      volume.gain.setValueAtTime(0.0001, now);
      volume.gain.exponentialRampToValueAtTime(partial.level, now + 0.006);
      volume.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay);
      oscillator.connect(volume);
      volume.connect(placementAudioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + partial.decay + 0.01);
    });

    placementSoundIndex = (placementSoundIndex + 1) % notes.length;
  }

  function playWinSound() {
    if (!placementAudioContext) return;

    const notes = [1864.66, 2349.32, 2793.83];
    const now = placementAudioContext.currentTime;

    notes.forEach((note, index) => {
      const start = now + index * 0.08;
      [
        { ratio: 1, level: 0.055, decay: 0.42 },
        { ratio: 2.015, level: 0.012, decay: 0.26 }
      ].forEach(partial => {
        const oscillator = placementAudioContext.createOscillator();
        const volume = placementAudioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note * partial.ratio, start);
        volume.gain.setValueAtTime(0.0001, start);
        volume.gain.exponentialRampToValueAtTime(partial.level, start + 0.006);
        volume.gain.exponentialRampToValueAtTime(0.0001, start + partial.decay);
        oscillator.connect(volume);
        volume.connect(placementAudioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + partial.decay + 0.01);
      });
    });
  }

  function createStarfield() {
    const starfield = $('.starfield')[0];
    const starColors = ['#ffffff', '#b9efff', '#ffe8a3'];

    for (let index = 0; index < 60; index++) {
      const star = document.createElement('span');
      const isStreak = index % 8 === 0;
      const duration = 10 + (index * 7) % 14;
      const delay = -((index * 11) % duration);
      const size = 1.2 + (index % 5) * 0.6;
      const color = starColors[index % starColors.length];
      const drift = ((index * 17) % 91) - 45;
      const y = (index * 29) % 100;
      const trailSize = 20 + (index % 4) * 10;

      star.className = isStreak ? 'star star-streak' : 'star';
      star.style.left = `${(index * 37) % 100}%`;
      star.style.setProperty('--star-size', `${size}px`);
      star.style.setProperty('--star-color', color);
      star.style.setProperty('--star-drift', `${drift}px`);
      star.style.setProperty('--star-duration', `${duration}s`);
      star.style.setProperty('--star-delay', `${delay}s`);
      star.style.setProperty('--star-y', `${y}vh`);
      star.style.setProperty('--star-trail', `${trailSize}px`);
      starfield.appendChild(star);
    }
  }

  createStarfield();

  $('.play-button').on('click', function () {
    const titleElem = $('.title-content');
    titleElem.addClass('anim-fadeOut');
    const bordElem = $('.bord-content');
    bordElem.addClass('bord-table-fadeIn');
    bordElem.show();
    setTimeout(function() {
      console.log('game init.');
      gameInit();
      gamef = true;
      $('.background-content').show();
    }, 2000);
  })

  $('.table-cell').on('click', function () {
    if (!gamef) { return }
    var clickTarget = $(this).attr('id').split('_');
    row = parseInt(clickTarget[1]);
    clm = parseInt(clickTarget[2]);
    targetNo = (row - 1) * 3 + clm - 1;
    console.log(targetNo)
    if (bord[targetNo] == 0) {
      playPlacementSound();
      bord[(row - 1) * 3 + clm - 1] = turn;
      var svgImg;
      //tableにsvg挟む処理
      if (turn == 1) {
        svgImg = '<img class="put-svg twink_token" src="./assets/circle.svg"/>'
        turn = 2
      } else {
        svgImg = '<img class="put-svg twink_token" src="./assets/x.svg"/>'
        turn = 1
      }
      $(this).append(svgImg)

      //ライフタイムの管理
      bord_lifeTime[targetNo] = 7;
      for (var n = 0; n <= bord_lifeTime.length - 1; n++){
        if (bord_lifeTime[n] != 0) {
          bord_lifeTime[n]--;
        }

        var y = parseInt((n / 3)) + 1;
        var x = n % 3 + 1
        
        if (bord_lifeTime[n] == 1) {
          targetElm = $('#cell_' + y + '_' + x);
          childImgElm = targetElm.children('.put-svg');
          childImgElm.css('opacity', '0.2');
          childImgElm.removeClass('twink_token');
        }

        if (bord_lifeTime[n] == 0) {
          targetElm = $('#cell_' + y + '_' + x);
          targetElm.empty();
          bord[n] = 0;
        }
      }

      //勝敗判定
      jugdeGame();

      if (winf) {
        playWinSound();
        for (var n = 0; n <= bord.length - 1; n++){
          y = parseInt((n / 3)) + 1;
          x = n % 3 + 1
          if (bord[n] != 0) {
            targetElm = $('#cell_' + y + '_' + x);
            childImgElm = targetElm.children('.put-svg');
            childImgElm.removeClass('twink_token');

            if (bord[n] == winturn) {
              childImgElm.addClass('win_token_anim');
            } else {
              childImgElm.addClass('lose_token_anim');
            }
          }
        }
        gamef = false;
        $('.play-again-button').prop('disabled', false).addClass('button-fadeIn-anim');
      }
    }
  });

  $('.play-again-button').on('click', function () {
    $(this).prop('disabled', true).removeClass('button-fadeIn-anim').css('opacity', '0');
    $('.bord-content').removeClass('bord-table-fadeIn');
    $('.bord-content').addClass('bord-table-fadeOut');
    setTimeout(function () {
      $('.play-again-button').removeClass('button-fadeIn-anim');
      $('.play-again-button').css('opacity', '0');
      $('.table-cell').empty();
      $('.bord-content').removeClass('bord-table-fadeOut');
      $('.bord-content').addClass('bord-table-fadeIn');
      $('.bord-content').show();
      setTimeout(function () { 
        console.log('game init.');
        gameInit();
        gamef = true;
      }, 2500);
    }, 1500);
  });

  function gameInit() {
    $('.play-again-button')
      .prop('disabled', true)
      .removeClass('button-fadeIn-anim')
      .css('opacity', '0');
    for (var n = 0; n <= bord.length - 1; n++){
      bord[n] = 0;
      bord_lifeTime[n] = 0;
    }
    turn = 1;
    winf = false;
    placementSoundIndex = 0;
  }

  function jugdeGame() {
    if (bord[0] == bord[1] && bord[0] == bord[2] && bord[0] != 0) {
      winf = true;
      winturn = bord[0];
      return
    }
    if (bord[3] == bord[4] && bord[3] == bord[5] && bord[3] != 0) {
      winf = true;
      winturn = bord[3];
      return
    }
    if (bord[6] == bord[7] && bord[6] == bord[8] && bord[6] != 0) {
      winf = true;
      winturn = bord[6];
      return
    }
    if (bord[0] == bord[3] && bord[0] == bord[6] && bord[0] != 0) {
      winf = true;
      winturn = bord[0];
      return
    }
    if (bord[1] == bord[4] && bord[4] == bord[7] && bord[1] != 0) {
      winf = true;
      winturn = bord[1];
      return
    }
    if (bord[2] == bord[5] && bord[2] == bord[8] && bord[2] != 0) {
      winf = true;
      winturn = bord[2];
      return
    }
    if (bord[0] == bord[4] && bord[0] == bord[8] && bord[0] != 0) {
      winf = true;
      winturn = bord[0];
      return
    }
    if (bord[2] == bord[4] && bord[2] == bord[6] && bord[2] != 0) {
      winf = true;
      winturn = bord[2];
      return
    }
  }
});
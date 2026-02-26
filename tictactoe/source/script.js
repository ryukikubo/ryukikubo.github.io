var gamef = false;
var bord = new Array(9);
var bord_lifeTime = new Array(9);
var turn = 1;
var winf = false;
var winturn = 0;
var winindex = new Array(3);

$(document).ready(function () {
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
        $('.play-again-button').addClass('button-fadeIn-anim');
      }
    }
  });

  $('.play-again-button').on('click', function () {
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
    for (var n = 0; n <= bord.length - 1; n++){
      bord[n] = 0;
      bord_lifeTime[n] = 0;
    }
    turn = 1;
    winf = false;
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
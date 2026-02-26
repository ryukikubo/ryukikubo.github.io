$(document).ready(function () {
  var bord = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]

  var dir = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,1],
    [1,-1],
    [1,0],
    [1,1]
  ]

  var moveTokenCurrentPoint = [0, 0]
  var bobailCurrentPoint = [2,2]
  var turn;
  var phase;
  var gameF = false;

  $('.title-btn').on('click', function () {
    $('.title-container').hide();
    readyToPlay();
    $('.game-container').show();
  });

  $('.table-cell').on('click', function () {
    if(!gameF){return}
    var targetId = $(this).attr('id');
    var row = parseInt(targetId.split('-')[1]) - 1;
    var clm = parseInt(targetId.split('-')[2]) - 1;
    if (phase == 1 && $(this).hasClass('can_move')) {
      moveBobail(row, clm);
      checkGameWinFlag();
      if (gameF) {
        phase = 2
        dispInfoMsg(turn,phase)
      }
    }
    if (phase == 2 && $(this).hasClass('p' + turn + '-token')) {
      $(this).addClass('current-select-token');
      moveTokenCurrentPoint[0] = row;
      moveTokenCurrentPoint[1] = clm;
      dispTokenMovePoint();
    }
    if (phase == 3) {
      if ($(this).hasClass('p' + turn + '-token') && !$(this).hasClass('current-select-token')) {
        $('.current-select-token').removeClass('current-select-token');
        $(this).addClass('current-select-token');
        $('.can_move').text('');
        $('.can_move').removeClass('can_move');
        moveTokenCurrentPoint[0] = row;
        moveTokenCurrentPoint[1] = clm;
        dispTokenMovePoint();
      }
      if ($(this).hasClass('can_move') && bord[row][clm] == 0) {
        $('.current-select-token').removeClass('current-select-token');
        moveToken(row, clm);
        checkGameWinFlag();
        if (gameF) {
          turnChange();
        }
      }
    }
  });


  function readyToPlay() {
    for (i = 0; i < 5; i++){
      for (n = 0; n < 5; n++){
        if (i == 0) {
          bord[i][n] = 1;
          $('#c-' + (i + 1) + "-" + (n + 1)).addClass('p1-token');
        }
        if (i == 2 && n == 2) {
          bord[i][n] = 3;
          $('#c-' + (i + 1) + "-" + (n + 1)).addClass('bobail');
        }
        if (i == 4) {
          bord[i][n] = 2;
          $('#c-' + (i + 1) + "-" + (n + 1)).addClass('p2-token');
        }
      }
    }
    turn = 1;
    phase = 2;
    dispInfoMsg();
    gameF = true;
  }

  function dispInfoMsg() {
    msg = "";
    if (phase == 1) {
      msg = "move Bobail.";
      if (turn == 1) {
        $('.p2-display').text('');
      } else {
        $('.p1-display').text('');
      }
    } else if (phase == 2) {
      msg = "move Your Token."
    }
    $('.p' + turn + '-display').text(msg);
  }

  function dispResultMsg(winner) {
    if (winner == 1) {
      $('.p1-display').text('you win!');
      $('.p2-display').text('you lose...');
    } else {
      $('.p2-display').text('you win!');
      $('.p1-display').text('you lose...');
    }
  }
  function dispTokenMovePoint() {
    var movePointExistF = false
    var bordOutF = false;
    var movePoint = [0, 0]
    for (i = 0; i < 8; i++){
      movePoint[0] = moveTokenCurrentPoint[0];
      movePoint[1] = moveTokenCurrentPoint[1];
      bordOutF = false;
      while (!bordOutF) {
        movePoint[0] += dir[i][0];
        movePoint[1] += dir[i][1];
        if (movePoint[0] < 0 || movePoint[0] > 4 || movePoint[1] < 0 || movePoint[1] > 4) {
          bordOutF = true;
        } else {
          if(bord[movePoint[0]][movePoint[1]] == 0){
            $('#c-' + (movePoint[0] + 1) + '-' + (movePoint[1] + 1)).text('・');
            $('#c-' + (movePoint[0] + 1) + '-' + (movePoint[1] + 1)).addClass('can_move');
            if (!movePointExistF) {
              movePointExistF = true;
            }
          } else {
            bordOutF = true;
          }
        }
      }
    }
    if (movePointExistF) {
      phase = 3
    }
  }

  function dispBovailMovePoint() {
    var bobailPoint = [0,0];
    for (i = 0; i < 8; i++){
      bobailPoint[0] = bobailCurrentPoint[0];
      bobailPoint[1] = bobailCurrentPoint[1];

      bobailPoint[0] += dir[i][0];
      bobailPoint[1] += dir[i][1];

      if (bobailPoint[0] > -1 && bobailPoint[1] > -1 && bobailPoint[0] < 5 && bobailPoint[1] < 5) {
        if (bord[bobailPoint[0]][bobailPoint[1]] == 0) {
          $('#c-' + (bobailPoint[0] + 1) + '-' + (bobailPoint[1] + 1)).text('・');
          $('#c-' + (bobailPoint[0] + 1) + '-' + (bobailPoint[1] + 1)).addClass('can_move');
        }
      }
    }
    $('.bobail').addClass('current-select-token');
  }

  function moveToken(toRow, toClm) {
    $('.can_move').text('');
    $('.can_move').removeClass('can_move');
    bord[moveTokenCurrentPoint[0]][moveTokenCurrentPoint[1]] = 0
    $('#c-' + (moveTokenCurrentPoint[0] + 1) + '-' + (moveTokenCurrentPoint[1] + 1)).removeClass('p' + turn + '-token');
    bord[toRow][toClm] = turn
    $('#c-' + (toRow + 1) + "-" + (toClm + 1)).addClass('p' + turn + '-token');
  }

  function moveBobail(toRow, toClm) {
    $('.can_move').text('');
    $('.can_move').removeClass('can_move');
    $('.current-select-token').removeClass('current-select-token');
    bord[bobailCurrentPoint[0]][bobailCurrentPoint[1]] = 0
    $('#c-' + (bobailCurrentPoint[0] + 1) + '-' + (bobailCurrentPoint[1] + 1)).removeClass('bobail');
    bord[toRow][toClm] = 3
    $('#c-' + (toRow + 1) + "-" + (toClm + 1)).addClass('bobail');
    bobailCurrentPoint[0] = toRow;
    bobailCurrentPoint[1] = toClm;
  }

  function turnChange() {
    if (turn == 1) {
      turn = 2
    } else {
      turn = 1
    }
    phase = 1
    setTimeout(function () {
      dispInfoMsg();
      dispBovailMovePoint();
    },800)
  }

  function checkGameWinFlag() {
    var collF = true

    if(bobailCurrentPoint[0] == 0){
      gameF = false;
      dispResultMsg(1);
    } else if (bobailCurrentPoint[0] == 4) {
      gameF = false;
      dispResultMsg(2);
    }

    for (i = 0; i < 8; i++){
      if (bobailCurrentPoint[0] + dir[i][0] > -1 && bobailCurrentPoint[0] + dir[i][0] < 5 && bobailCurrentPoint[1] + dir[i][1] > -1 && bobailCurrentPoint[1] + dir[i][1] < 5) {
        if (bord[bobailCurrentPoint[0] + dir[i][0]][bobailCurrentPoint[1] + dir[i][1]] == 0) {
          collF = false;
          break;
        }
      }
    }
    if (collF) {
      gameF = false;
      dispResultMsg(turn);
    }
  }
})
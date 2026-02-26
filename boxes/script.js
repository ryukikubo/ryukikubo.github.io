$(document).ready(function () {

  const P1_SET_TRAP = 1;
  const P2_SET_TRAP = 2;
  const P1_CHOICE_BOX = 3;
  const P2_CHOICE_BOX = 4;
  const SHOW_THE_TRAP_BOX = 5;
  
  var round = 1;
  var turn = 1;
  var trapIndex = 0;
  var choiceIndex = 0;
  var phase;
  var boxLeft = 12;
  var gameF = false;
  var p1 = {
    'traped_count': 0,
    'point':0
  }
  var p2 = {
    'traped_count': 0,
    'point' : 0
  }

  $('.start_btn').on('click', function () {
    $('.title-box').hide();
    $('.game-content-box').show();
    gameF = true;
    phase = P2_SET_TRAP;
    $('.set-trap-btn').addClass('disabled');
    $('.round_disp').show();
    $('.round_disp').addClass('anim-rollIn');
    setTimeout(function () {
      $('.round_disp').hide();
      $('.round_disp').removeClass('anim-rollIn');
    }, 2500);
  });

  $('.box').on('click', function () {

    if (!gameF) {
      return;
    }

    if ($(this).hasClass('used_box')) {
      return;
    }

    if (phase == P1_SET_TRAP || phase == P2_SET_TRAP){
      var currentSelect = parseInt($(this).attr('id').replace('box_', ''));
      if (trapIndex == 0) {
        $(this).addClass('selecting-box');
        $('.set-trap-btn').removeClass('disabled');
        trapIndex = currentSelect;
      } else {
        if (trapIndex == currentSelect) {
          trapIndex = 0;
          $(this).removeClass('selecting-box');
          $('.set-trap-btn').addClass('disabled');
        } else {
          currentSelectElm = $('#box_' + trapIndex);
          currentSelectElm.removeClass('selecting-box');
          $(this).addClass('selecting-box');
          trapIndex = currentSelect;
        }
      }
    } else {
      var currentSelect = parseInt($(this).attr('id').replace('box_', ''));
      if (choiceIndex == 0) {
        $(this).addClass('selecting-box');
        $('.choice-box-btn').removeClass('disabled');
        choiceIndex = currentSelect;
      } else {
        if (choiceIndex == currentSelect) {
          choiceIndex = 0;
          $(this).removeClass('selecting-box');
          $('.choice-box-btn').addClass('disabled');
        } else {
          currentSelectElm = $('#box_' + choiceIndex);
          currentSelectElm.removeClass('selecting-box');
          $(this).addClass('selecting-box');
          choiceIndex = currentSelect;
        }
      }
    }
  });

  $('.set-trap-btn').on('click', function () {
    if ($(this).hasClass('disabled')) {
      return;
    }
    $('#set-trap-msg').text('You set the Trap to 『' + trapIndex + '』');
    $('#set-trap-confirm').show();
    $('#set-trap-confirm').addClass('anim-rollIn');
  });

  $('.set-trap-submit').on('click', function () {
    $('#set-trap-confirm').hide();
    $('#set-trap-confirm').removeClass('anim-rollIn');
    $('.selecting-box').removeClass('selecting-box');
    if (phase == P1_SET_TRAP) {
      $('.main-info').text('Turn Of Player 2');
      phase = P2_CHOICE_BOX;
    } else {
      $('.main-info').text('Turn Of Player 1');
      phase = P1_CHOICE_BOX;
    }
    $('.discription').text('choose a box you want');
    $('.set-trap-btn').addClass('disabled');
    $('.set-trap-btn').hide();
    $('.choice-box-btn').show();  
  });

  $('.set-trap-cancel').on('click', function () {
    $('#set-trap-confirm').hide();
    $('#set-trap-confirm').removeClass('anim-rollIn');
  });

  $('.choice-box-btn').on('click', function () {

    if ($(this).hasClass('disabled')) {
      return;
    }

    $('.choice-box-btn').css('background-color', '#999');
    setTimeout(function () {
      if (trapIndex != choiceIndex) {
        $('.safe_disp').show();
        $('.safe_disp').addClass('anim-rollIn-fast');
        setTimeout(function () {
          $('.safe_disp').hide();
          $('.safe_disp').removeClass('anim-rollIn-fast');
          if (turn % 2 == 1) {
            $('#p_1_' + round).text(choiceIndex);
            p1.point += parseInt(choiceIndex);
            $('#p_1_total').text(p1.point);
            if (p1.point >= 40) {
              gameF = false;
              // winner is player 1
              gameEnd(1);
            } else {
              boxLeft--;
              if (boxLeft == 1) {
                gameF = false;
                if (p1.point > p2.point) {
                  // winner is player 1
                  gameEnd(1);
                } else if (p2.point < p1.point) {
                  // winner is player 2
                  gameEnd(2);
                } else {
                  // draw
                }
              }
            }
          } else {
            $('#p_2_' + round).text(choiceIndex);
            p2.point += parseInt(choiceIndex);
            $('#p_2_total').text(p2.point);
            if (p2.point >= 40) {
              gameF = false;
              // winner is player 2
              gameEnd(2);
            } else {
              boxLeft--;
              if (boxLeft == 1) {
                gameF = false;
                if (p1.point > p2.point) {
                  // winner is player 1
                  gameEnd(1);
                } else if (p2.point < p1.point) {
                  // winner is player 2
                  gameEnd(2);
                } else {
                  // draw
                }
              }
            }

          }
          $('.choice-box-btn').hide();
          $('.choice-box-btn').addClass('disabled');
          $('.choice-box-btn').css('background-color', '');
          $('.next-btn').show();
          $('.main-info').text('Where is Trap?');
          $('.discription').text('trap is...');
          $('#box_' + trapIndex).addClass('anim-show-trap');
        }, 2000);
      } else {
        $('.selecting-box').removeClass('selecting-box');
        $('.content-container').css('background-color', '#F00');
        setTimeout(function () {
          $('.out_disp').show();
          $('.out_disp').addClass('anim-rollIn-fast');
          setTimeout(function () {
            $('.out_disp').hide();
            $('.out_disp').removeClass('anim-rollIn-fast');
            $('.content-container').css('background-color', '#000');

            if (turn % 2 == 1) {
              $('#p_1_' + round).text("X");
              p1.traped_count++;
              p1.point = 0;  
              $('#p_1_total').text(p1.point);
              if (p1.traped_count == 3) {
                gameF = false;
                // winner is player 2
                gameEnd(2);
              } else {
                turn = 2;
                phase = P1_SET_TRAP;
                $('.discription').text('choose the trap-box');
              }
            } else {
              $('#p_2_' + round).text("X");
              p2.traped_count++;
              p2.point = 0;
              $('#p_2_total').text(p2.point);
              if(p2.traped_count == 3){
                gameF = false;
                // winner is player 1
                gameEnd(1);
              } else {
                round++;
                $('.round_disp').text('ROUND ' + round);
                $('.round_disp').show();
                $('.round_disp').addClass('anim-rollIn');
                setTimeout(function () {
                  $('.round_disp').hide();
                  $('.round_disp').removeClass('anim-rollIn');
                  turn = 1;
                  phase = P2_SET_TRAP;
                  $('.discription').text('choose the trap-box');
                }, 2500);
              }
            }

            $('.choice-box-btn').hide();
            $('.choice-box-btn').addClass('disabled');
            $('.choice-box-btn').css('background-color', '');
            trapIndex = 0;
            choiceIndex = 0;
            $('.set-trap-btn').show();
          },2000)
        }, 1000);
      }
    }, 3000)
  });

  $('.next-btn').on('click', function () {
    $('.selecting-box').removeClass('selecting-box');
    $('#box_' + trapIndex).removeClass('anim-show-trap');
    $('#box_' + choiceIndex).addClass('used_box');
    trapIndex = 0;
    choiceIndex = 0;
    $('.next-btn').hide();
    $('.set-trap-btn').show();
    if (turn % 2 == 1) {
      turn = 2;
      phase = P1_SET_TRAP;
      $('.main-info').text('Turn Of Player 1');
    } else {
      round++;
      $('.round_disp').text('ROUND ' + round);
      $('.round_disp').show();
      $('.round_disp').addClass('anim-rollIn');
      setTimeout(function () {
        $('.round_disp').hide();
        $('.round_disp').removeClass('anim-rollIn');
        turn = 1;
        phase = P2_SET_TRAP;
      $('.main-info').text('Turn Of Player 2');
      }, 2500);
    }
    $('.discription').text('choose the trap-box');
  });

  function gameEnd(winnerTurn) {
    $('.game_end_disp').show();
    $('.game_end_disp').addClass('anim-rollIn-fast');
    setTimeout(function () {
      $('.game_end_disp').hide();
      $('.game_end_disp').removeClass('anim-rollIn-fast');
      $('.main-info').html('WINNER IS <br> PLAYER ' + winnerTurn + '!');
      $('.discription').text('congratulation!');
    }, 2000);
  }
})
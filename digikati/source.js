$(document).ready(function () {
  
    var colorIndex = ["#ff7f7f","#ff7fff","#ffbfff","#7fffff","#7fff7f","#ffff7f","#ffbf7f"];
    var CounterCnt = 1;
    function updateProbCell($countInput) {
        var selectedInput = $('input[name="current_input"]:checked').val();
        var gameValue;
        if (selectedInput === 'game') {
            gameValue = parseInt($('.game_input').val()) || 0;
        } else if (selectedInput === 'memory') {
            gameValue = parseInt($('.memory_input').val()) || 0;
        } else {
            gameValue = 0;
        }
        
        if (gameValue < 1) {
            $countInput.closest('tr').find('.prob_cell').text('-');
            return;
        }
        var countValue = parseInt($countInput.val()) || 0;
        
        var $probCell = $countInput.closest('tr').find('.prob_cell');
        
        var probValue = ((countValue === 0) ? "-" : "1/" + (gameValue / countValue).toFixed(2));
        $probCell.text(probValue);
    }

    $(document).on('click', '.count_button', function() {
        var $button = $(this);
        var $countInput = $button.closest('tr').find('.count_input');
        
        $button.addClass('clicked');

        setTimeout(function() {
            $button.removeClass('clicked');
        }, 100);

        var countValue = parseInt($countInput.val()) || 0;
        $countInput.val(countValue + 1);
        
        updateProbCell($countInput);
    });
    
    $(document).on('input', '.count_input', function () {
        var $countInput = $(this);
        updateProbCell($countInput);
    })
    $('.game_input').on('change', function() {
        var selectedInput = $('input[name="current_input"]:checked').val();
        if (selectedInput === 'game'){
            $('.count_input').each(function() {
                updateProbCell($(this));
            });
        }
    });
    $('.memory_input').on('change', function() {
        var selectedInput = $('input[name="current_input"]:checked').val();
        if (selectedInput === 'memory'){
            $('.count_input').each(function() {
                updateProbCell($(this));
            });
        }
    });

    $('input[name="current_input"]').on('change', function() {
        var val = $(this).val();
        if (val === 'game') {
            $('#label_for_game').addClass('current_choice');
            $('#label_for_memory').removeClass('current_choice');
        } else if (val === 'memory') {
            $('#label_for_memory').addClass('current_choice');
            $('#label_for_game').removeClass('current_choice');
        }
        $('.count_input').each(function() {
            updateProbCell($(this));
        });
    });

    // 初期状態で選択されているラジオボタンに合わせてラベルの色付け
    (function() {
        var val = $('input[name="current_input"]:checked').val();
        if (val === 'game') {
            $('#label_for_game').addClass('current_choice');
            $('#label_for_memory').removeClass('current_choice');
        } else if (val === 'memory') {
            $('#label_for_memory').addClass('current_choice');
            $('#label_for_game').removeClass('current_choice');
        }
    })();

    $('.add_button').on('click', function () {
        var $button = $(this);
        $button.addClass('clicked');
        setTimeout(function() {
            $button.removeClass('clicked');
        }, 50);
        
        var newCounter = $('.counter_copy').clone().removeClass('counter_copy').show();
        var color = colorIndex[CounterCnt % 7];
        newCounter.find('.count_button').css('background-color', color);
        CounterCnt++;
        
        $('.counter_box').append(newCounter);
    });

    $(document).on('click', '.remove_button', function() {
        $(this).closest('.counter').fadeOut(150, function() {
            $(this).remove();
        });
    });

});
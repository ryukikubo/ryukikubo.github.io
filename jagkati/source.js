$(document).ready(function () {
  
    var colorIndex = ["#ff7f7f","#ff7fff","#ffbfff","#7fffff","#7fff7f","#ffff7f","#ffbf7f"];
    var CounterCnt = 1;
    function updateProbCell($countInput) {
        var gameValue = parseInt($('.game_input').val()) || 0;
        
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

        $('.count_input').each(function() {
            updateProbCell($(this));
        });
    });

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
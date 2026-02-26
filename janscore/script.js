var playerCount = 0;
var playerNames = [];
var playerRanks = [];
var startPoint = 0;
var endPoint = 0;
var bustLimit = 0;
var bonasPoints = [];
var bustBonasPoint = 0;
var playerSettingF = false;
var pointSettingF = false;
var resultInputF = false;
var bustF = [false,false,false,false];
var gameCount = 0;
const colorSequence = ["--c_blue", "--c_red", "--c_yellow", "--c_pink", "--c_purple", "--c_green", "--c_brown", "--c_gray", "--c_black"];
const colorSequenceBG = ["--b_blue", "--b_red", "--b_yellow", "--b_pink", "--b_purple", "--b_green", "--b_brown", "--b_gray", "--b_black"];
var currentIndex = 0;

$(document).ready(function () {

    //console.log(colorSetting);
	$(".modal").hide();
	$("#setting-info-header").hide();
	$(".setting-info-container").hide();
	$(".container-header").hide();
	$(".result-table-container").hide();

	$('.content-header').on('click', function () {
		currentIndex = (currentIndex + 1) % colorSequence.length;
		document.documentElement.style.setProperty('--settingColor', `var(${colorSequence[currentIndex]})`);
		document.documentElement.style.setProperty('--settingBGColor', `var(${colorSequenceBG[currentIndex]})`);
  });

	$('[name="player-count"]').change(function () {
		playerCount = $(this).val();
		
		$('.player-name-input').show();
		if (playerCount == 3) {
			$('.player4').hide();
		} else {
			$('.player4').show();
		}
	});

	$('.input-result-point').on('input', function () {
		resultInputCheck();
	});

	$('.select-position').on('chenge', function () {
		resultInputCheck();
	})
});


// トースト通知クラス
var Toast = (function(){
	var timer;
	var speed;
    function Toast() {
		this.speed = 2500;
    }
    // メッセージを表示。表示時間(speed)はデフォルトで3秒
	Toast.prototype.show = function (message, speed) {
		if (speed === undefined) speed = this.speed;
		$('.toast').remove();
		clearTimeout(this.timer);
		$('body').append('<div class="toast">' + message + '</div>');
		var leftpos = $('body').width()/2 - $('.toast').outerWidth()/2;
		$('.toast').css('left', leftpos).hide().fadeIn('fast');
	
		this.timer = setTimeout(function() {
			$('.toast').fadeOut('slow',function(){
				$(this).remove();
			});
		}, speed);
	};
    // 明示的にメッセージを消したい場合は使う
	Toast.prototype.hide = function() {
		$('.toast').fadeOut('slow',function() {
			$(this).remove();
		});
	}
    return Toast;
})();


function openModal(modalName) {
	switch (modalName) {
		case "point":
			if (playerSettingF) {
				$("#point-setting").show();
				if (playerCount == 3) {
					$('#4th-bonas-input').hide();
				}
			}
			break;
		case "player":
			if (playerCount == 0) {
				$('.player-name-input').hide();
			} else {
			}
			$("#player-setting").show();
			break;
		case "result":
			resultInput();
			break;
		case "color":
			$('#color-setting').show();
			break;
		default:
			break;
	}
}

function modalClose(modalName){
	switch (modalName) {
		case "player":
			$("#player-setting").hide();
			$('#player1-name-empty-error').hide();
			$('#player2-name-empty-error').hide();
			$('#player3-name-empty-error').hide();
			$('#player4-name-empty-error').hide();
			break;
		case "point" :
			$("#point-setting").hide();
			$('#start-point-not-empty').hide();
			$('#start-point-mast-integer').hide();
			$('#end-point-not-empty').hide();
			$('#end-point-mast-integer').hide();
			$('#end-point-mast-over-start-point').hide();
			$('#bonas-input-error').hide();
			$('#bust-bonas-input-error').hide();
			break;
		case "result":
			bustF = [false,false,false,false];
			$("#result-input").hide();
			$('#player1-position').prop('selectedIndex', -1);
			$('#player2-position').prop('selectedIndex', -1);
			$('#player3-position').prop('selectedIndex', -1);
			$('#player4-position').prop('selectedIndex', -1);
			$('#player1-point-empty-error').hide();
			$('#player2-point-empty-error').hide();
			$('#player3-point-empty-error').hide();
			$('#player4-point-empty-error').hide();
			$('#invalid-result-error').hide();
			$('#invalid-position-error').hide();
			$('.bust-select-container').hide();
			break;
		default:
			break;
	}
}

function resultInput() {
	if (!playerSettingF || !pointSettingF) { return; }
	$('.bust-select').empty();
	$('#player1-point-name-label').text(playerNames[0]);
	var playerOption = $('<option>',{
		value:1,
		text:playerNames[0], 
	});
	$('.bust-select').append(playerOption);
	$('#player1-point').val('');
	$('#player2-point-name-label').text(playerNames[1]);
	playerOption = $('<option>',{
		value:2,
		text:playerNames[1], 
	});
	$('.bust-select').append(playerOption);
	$('#player2-point').val('');
	$('#player3-point-name-label').text(playerNames[2]);
	playerOption = $('<option>',{
		value:3,
		text:playerNames[2], 
	});
	$('.bust-select').append(playerOption);
	$('#player3-point').val('');
	if (playerCount == 4) {
		$('#player4-point-name-label').text(playerNames[3]);
		playerOption = $('<option>',{
			value:4,
			text:playerNames[3], 
		});
		$('.bust-select').append(playerOption);
		$('#player4-point').val('');
	} else {
		$(".player4").hide();
		$(".hideOptionfor4").hide();
	}
	bustF = [false,false,false,false];
	$('.bust-select-container').hide();
	$('#result-input').show();

}

function setResult() {
	//バリデーションチェック
	var validF = true;
	var totalPoint = 0;
	var pointArray = [];
	var positionIndex = [];
	var resultPoint = [];
	//点数欄が空白でないか
	var player1ResultInput = parseFloat($('#player1-point').val()) * 100;
	var player2ResultInput = parseFloat($('#player2-point').val()) * 100;
	var player3ResultInput = parseFloat($('#player3-point').val()) * 100;
	if(playerCount == 4){
		var player4ResultInput = parseFloat($('#player4-point').val()) * 100;
	}

	if(isNaN(player1ResultInput)){
		$('#player1-point-empty-error').show();
		return;
	}else{
		$('#player1-point-empty-error').hide();
		pointArray.push(player1ResultInput);
		totalPoint += player1ResultInput;
	}

	if(isNaN(player2ResultInput)){
		$('#player2-point-empty-error').show();
		return;
	}else{
		$('#player2-point-empty-error').hide();
		pointArray.push(player2ResultInput);
		totalPoint += player2ResultInput;
	}

	if(isNaN(player3ResultInput)){
		$('#player3-point-empty-error').show();
		return;
	}else{
		$('#player3-point-empty-error').hide();
		pointArray.push(player3ResultInput);
		totalPoint += player3ResultInput;
	}

	if(playerCount == 4){
		if(isNaN(player4ResultInput)){
			$('#player4-point-empty-error').show();
			return;
		}else{
			$('#player4-point-empty-error').hide();
			pointArray.push(player4ResultInput);
			totalPoint += player4ResultInput;
		}
	}

	if(playerCount == 3){
		if (totalPoint != startPoint * 3) {
			var pointDef = startPoint * 3 - totalPoint;
			if (pointDef > 0) {
				$('#invalid-result-error').html("最終持ち点の入力が不正です(入力が" + pointDef + "点少ないです)");
			} else {
				pointDef *= -1
				$('#invalid-result-error').html("最終持ち点の入力が不正です(入力が" + pointDef + "点多いです)");
			}
			$('#invalid-result-error').show();
			return;
		}
	}else{
		if (totalPoint != startPoint * 4) {
			var pointDef = startPoint * 4 - totalPoint;
			if (pointDef > 0) {
				$('#invalid-result-error').html("最終持ち点の入力が不正です(入力が" + pointDef + "点少ないです)");
			} else {
				pointDef *= -1
				$('#invalid-result-error').html("最終持ち点の入力が不正です(入力が" + pointDef + "点多いです)");
			}
			$('#invalid-result-error').show();
			return;
		}
	}

	//風家のバリデーションチェック

	if ($('#player1-position').prop('selectedIndex') == -1) {
		$('#invalid-position-error').show();
		return;
	} else {
		positionIndex.push($('#player1-position').prop('selectedIndex'));
	}

	if ($('#player2-position').prop('selectedIndex') == -1) {
		$('#invalid-position-error').show();
		return;
	} else if (positionIndex.includes($('#player2-position').prop('selectedIndex'))) {
		$('#invalid-position-error').show();
		return;
	} else {
		positionIndex.push($('#player2-position').prop('selectedIndex'));
	}

	if ($('#player3-position').prop('selectedIndex') == -1) {
		$('#invalid-position-error').show();
		return;
	} else if (positionIndex.includes($('#player3-position').prop('selectedIndex'))) {
		$('#invalid-position-error').show();
		return;
	} else {
		positionIndex.push($('#player3-position').prop('selectedIndex'));
	}
	
	if (playerCount == 4) {
		if ($('#player4-position').prop('selectedIndex') == -1) {
			$('#invalid-position-error').show();
			return;
		} else if (positionIndex.includes($('#player4-position').prop('selectedIndex'))) {
			$('#invalid-position-error').show();
			return;
		} else {
			positionIndex.push($('#player4-position').prop('selectedIndex'));
		}
	}

	$('#invalid-position-error').hide();
	setResultPoint(pointArray,positionIndex);
}

function setResultPoint(pointArray,positionIndex){
	var lankArray = [];
	var scoreArray = [];
	var parentIndex = 0;
	if(playerCount == 3){
		lankArray = [0,0,0];
		scoreArray = [0,0,0];
	}else{
		lankArray = [0,0,0,0];
		scoreArray = [0,0,0,0];
	}
	var i,j

	for(i = 0 ; i <=  lankArray.length - 2;i++){
		for (j = i + 1; j <= lankArray.length - 1; j++){
			if (positionIndex[j] == 0) {
				parentIndex = j
			}
			if(pointArray[i] > pointArray[j]){
				lankArray[j] += 1;
			}else if(pointArray[i] < pointArray[j]){
				lankArray[i] += 1;
			}else{
				if(positionIndex[i] < positionIndex[j]){
					lankArray[j] += 1;
				}else{
					lankArray[i] += 1;
				}
			}
		}
	}

	var okaPoint = 0
	if(startPoint != endPoint){
		var okaBonus = (endPoint - startPoint) * playerCount;
		if(okaBonus % 1000 == 0){
			okaPoint = okaBonus / 1000;
		}else{
			okaPoint = parseFloat((okaBonus/1000).toFixed(1));
		}
		
	}
	for(i = 0; i < pointArray.length; i++){
		var point = pointArray[i] - endPoint;
		if(point % 1000 == 0){
			scoreArray[i] += point / 1000;
		}else{
			scoreArray[i] += parseFloat((point/1000).toFixed(1));
		}
		
		scoreArray[i] += bonasPoints[lankArray[i]];

		if(lankArray[i] == 0){
			scoreArray[i] += okaPoint;
		}

		if(bustF[i]){
			scoreArray[i] -= bustBonasPoint;
			bustBonasTargetID = 'bust-select-p' + (i + 1);
			bustSelectedIndex = $('#' + bustBonasTargetID).prop('selectedIndex');
			scoreArray[bustSelectedIndex] += bustBonasPoint;
		}
	}

	dispResultPoint(scoreArray,pointArray,parentIndex);
}

function dispResultPoint(scoreArray,pointArray,parentIndex){
	if(gameCount == 0){
		$("#disp-result-table").show();
		$('#player1-name-header').text(playerNames[0]);
		$('#player2-name-header').text(playerNames[1]);
		$('#player3-name-header').text(playerNames[2]);
		if(playerCount == 4){
			$('#player4-name-header').text(playerNames[3]);
		}else{
			$('#player4-name-header').hide();
		}
		$('.result-table-container').show();
	}

	gameCount += 1;
	var newRow = $('<tr>');
	newRow.prepend($('<td>').text(gameCount));
	for (var i = 0; i < scoreArray.length; i++){
		var td = $('<td>');
		if (i == parentIndex) {
			td.addClass('parent_data');
		}
		td.html(scoreArray[i] + ' (' + pointArray[i].toLocaleString() + ')');
		newRow.append(td);
	}

	/*var buttonTd = $('<td class="fix-btn-clm">');
	var fixButton = $('<input>', {
		type: 'button',
		class: 'btn-fix',
		value: '修正',
		onclick: 'fixScore(' + gameCount + ')'
	});

	buttonTd.append(fixButton);
	newRow.append(buttonTd);*/

	/*if(playerCount == 3){
		newRow = $('<tr>',{
			html:'<td>'+gameCount+'</td>'+
			'<td>' + scoreArray[0] + ' (' + pointArray[0].toLocaleString() + ')</td>' +
			'<td>' + scoreArray[1] + ' (' + pointArray[1].toLocaleString() + ')</td>' +
			'<td>' + scoreArray[2] + ' (' + pointArray[2].toLocaleString() + ')</td>' +
			'<td class="fix-btn-clm">' + '</td>'
		});
	}else{
		newRow = $('<tr>',{
			html:'<td>'+gameCount+'</td>'+
			'<td>' + scoreArray[0] + ' (' + pointArray[0].toLocaleString() + ')</td>' +
			'<td>' + scoreArray[1] + ' (' + pointArray[1].toLocaleString() + ')</td>' +
			'<td>' + scoreArray[2] + ' (' + pointArray[2].toLocaleString() + ')</td>' +
			'<td>' + scoreArray[3] + ' (' + pointArray[3].toLocaleString() + ')</td>' +
			'<td class="fix-btn-clm">' + '</td>'
		});
	}*/

	$('.result-table .result-point-sum').before(newRow);
	if(gameCount == 1){
		$('#player1-total').text(scoreArray[0]);
		$('#player2-total').text(scoreArray[1]);
		$('#player3-total').text(scoreArray[2]);
		if(playerCount == 4){
			$('#player4-total').text(scoreArray[3]);
		}else{
			$('#player4-total').hide()
		}
	}else{
		var point;
		point = parseFloat($('#player1-total').text()) + scoreArray[0];
		$('#player1-total').text(point);
		point = parseFloat($('#player2-total').text()) + scoreArray[1];
		$('#player2-total').text(point);
		point = parseFloat($('#player3-total').text()) + scoreArray[2];
		$('#player3-total').text(point);
		if(playerCount == 4){
			point = parseFloat($('#player4-total').text()) + scoreArray[3];
			$('#player4-total').text(point);
		}
	}

	modalClose('result');
	var toast = new Toast();
	toast.show('結果入力が完了しました。');

}
function fixScore(gameIndex) {
	
}


function setPlayerSetting() {
	
	let nameNotNullF = true;
	let player1Name, player2Name, player3Name, player4Name;

	if (playerCount == 0) {
		return;
	}

	//validation check
	player1Name = $('#player1-name').val();
	player2Name = $('#player2-name').val();
	player3Name = $('#player3-name').val();
	player4Name = $('#player4-name').val();

	if (player1Name == '') {
		$('#player1-name-empty-error').show();
		nameNotNullF = false;
	} else {
		$('#player1-name-empty-error').hide();
	}

	if (player2Name == '') {
		$('#player2-name-empty-error').show();
		nameNotNullF = false;
	} else {
		$('#player2-name-empty-error').hide();
	}

	
	if (player3Name == '') {
		$('#player3-name-empty-error').show();
		nameNotNullF = false;
	} else {
		$('#player3-name-empty-error').hide();
	}

	if (playerCount == 4) {
		if (player4Name == '') {
			$('#player4-name-empty-error').show();
			nameNotNullF = false;
		} else {
			$('#player4-name-empty-error').hide();
		} 
	}

	if (nameNotNullF) {
		if (playerCount == 4) {
			playerNames = [player1Name, player2Name, player3Name, player4Name]
		} else {
			playerNames = [player1Name,player2Name,player3Name]
		}
		playerSettingF = true
		modalClose('player');
		var toast = new Toast();
		toast.show('プレイヤー設定が完了しました');
	}

}

function setPointSetting() {
	let validF = true;
	startPoint = $('#start-point-val').val() * 1000;
	endPoint = $('#end-point-val').val() * 1000;
	let bonas1st = parseInt($('#1st-bonas').val());
	let bonas2nd = parseInt($('#2nd-bonas').val());
	let bonas3rd = parseInt($('#3rd-bonas').val());
	let bonas4th;
	bustBonasPoint = parseInt($('#bust-bonas').val());
	if (playerCount == 4) {
		bonas4th = parseInt($('#4th-bonas').val());
	}

	if (startPoint == '') {
		$('#start-point-not-empty').show();
		validF = false;
	} else {
		$('#start-point-not-empty').hide();
	}
	
	if (startPoint <= 0 && startPoint != '') {
		$('#start-point-mast-integer').show();
		validF = false;
	} else {
		$('#start-point-mast-integer').hide();
	}

	if (endPoint == '') {
		$('#end-point-not-empty').show();
		validF = false;
	} else {
		$('#end-point-not-empty').hide();
	}

	if (endPoint <= 0 && endPoint != '') {
		$('#end-point-mast-integer').show();
		validF = false;
	} else {
		$('#end-point-mast-integer').hide();
	}

	if (endPoint < startPoint) {
		$('#end-point-mast-over-start-point').show();
		validF = false;
	} else {
		$('#end-point-mast-over-start-point').hide();
	}

	let bonasSum = bonas1st + bonas2nd + bonas3rd;

	if (playerCount == 4) {
		bonasSum += bonas4th;
	}

	if (bonasSum != 0) {
		$('#bonas-input-error').show();
		validF = false;
	} else {
		$('#bonas-input-error').hide();
	}

	if (bustBonasPoint < 0 || bustBonasPoint === '') {
		$('#bust-bonas-input-error').show();
		validF = false;
	} else {
		$('#bust-bonas-input-error').hide();
	}

	if (validF) {

		var isChecked = $('#bust-setting').is(':checked')
		if (isChecked) {
			bustLimit = 0
		} else {
			bustLimit = -1
		}

		if (playerCount == 3) {
			bonasPoints = [bonas1st,bonas2nd,bonas3rd]
		} else {
			bonasPoints = [bonas1st,bonas2nd,bonas3rd,bonas4th]
		}
		pointSettingF = true;
		modalClose('point');

		var toast = new Toast();
		toast.show('点数設定が完了しました。');
		showSettingInfo();
	}

}

function showSettingInfo(){
	$("#player-count-info").text(playerCount + "人");
	$("#start-point-info").text(startPoint);
	$("#end-point-info").text(endPoint);
	$("#1st-bonas-info").text("1位:"+bonasPoints[0]);
	$("#2nd-bonas-info").text("2位:"+bonasPoints[1]);
	$("#3rd-bonas-info").text("3位:"+bonasPoints[2]);
	if(playerCount == 4){
		$("#4th-bonas-info").text("4位:"+bonasPoints[3]);
	}else{
		$("#4th-bonas-info").text('');
	}

	if (bustLimit == 0) {
		$('#bust-limit-info').text('YES')
	} else {
		$('#bust-limit-info').text('NO')
	}
	$("#bust-bonas-info").text(bustBonasPoint);
	$("#setting-info-header").show();
	$(".setting-info-container").show();
}

//トビの点数が入力された時、トビの入力欄を表示する
function resultInputCheck() {
	
	var player1ResultInput = parseFloat($('#player1-point').val());
	var player2ResultInput = parseFloat($('#player2-point').val());
	var player3ResultInput = parseFloat($('#player3-point').val());
	if(playerCount == 4){
		var player4ResultInput = parseFloat($('#player4-point').val());
	}

	//チェック

	if (player1ResultInput !== '' && player1ResultInput <= bustLimit) {
		$('#bust-p1').show();
		if(!bustF[0]){
			bustF[0] = true;
		}
	} else {
		$('#bust-p1').hide();
		if(bustF[0]){
			bustF[0] = false;
		}
	}

	if (player2ResultInput !== '' && player2ResultInput <= bustLimit) {
		$('#bust-p2').show();
		if(!bustF[1]){
			bustF[1] = true;
		}
	} else {
		$('#bust-p2').hide();
		if(bustF[1]){
			bustF[1] = false;
		}
	}

	if (player3ResultInput !== '' && player3ResultInput <= bustLimit) {
		$('#bust-p3').show();
		if(!bustF[2]){
			bustF[2] = true;
		}
	} else {
		$('#bust-p3').hide();
		if(bustF[2]){
			bustF[2] = false;
		}
	}

	if(playerCount == 4){
		if (player4ResultInput !== '' && player4ResultInput <= bustLimit) {
			$('#bust-p4').show();
			if(!bustF[3]){
				bustF[3] = true;
			}
		} 
	} else {
		$('#bust-p4').hide();
		if(bustF[3]){
			bustF[3] = false;
		}
	}
}

function memo(){

}
$(document).ready(function () {
	var leftPosArray = [];
	var currentDispIndex = 0;
		$(".error").hide();
		$(".result").hide();
		$('.disp').each(function(index, element) {
			// 要素のjQueryオブジェクトを取得
			var $element = $(element);
			
			// elementの幅を取得
			var width = $element.outerWidth();

			// elementのleft位置を取得
			var left = $element.position().left;
		});
		$('input[name="dispSelect"]').change(function() {
			const selectedIndex = $(this).val();
			const selectedDisp = $('.content_table > .disp').eq(selectedIndex);
			var marginLeft = parseInt(selectedDisp.css("margin-right"));
			$('.content_table').animate({
				scrollLeft: (selectedIndex - currentDispIndex) * (selectedDisp.outerWidth() + marginLeft)
			}, 'slow');
		});
	
		$("#go").click(function(){
			var machine_num = $(".machine_num").val();
			var select_errorFlg = 0;
			var input_errorFlg = 0;
			var bigcnt = $(".bigcnt").val();
			var regcnt = $(".regcnt").val();
			var gamecnt = $(".allgame").val();
			var assetVal = $(".asset").val();
			var select_machine = $("input[name='machine']:checked").attr('id');
			var machine_name_index = $("input[name='machine']:checked").val();
			var machine_name_array = ["アイムジャグラーEX","MyジャグラーV","ファンキージャグラー2","ハッピージャグラー VIII","GOGOジャグラー 3"];
			//バリデーションチェック

			if(select_machine === undefined){
				select_errorFlg = 1;
			}

			if(gamecnt === "" || gamecnt <= 0){
				input_errorFlg = 1;
			}

			if(machine_num === "" || machine_num <= 0){
				machine_num = 0;
			}

			if(bigcnt === "" || bigcnt <= 0){
				bigcnt = 0;
			}

			if(regcnt === "" || regcnt <= 0){
				regcnt = 0;
			}

			if(assetVal === ""){
				assetVal = 0;
			}

			//正異常処理分岐

			if(select_errorFlg != 1 && input_errorFlg != 1){

				//正常系
				$(".error").hide();
				machine_name = machine_name_array[machine_name_index];
				$(".select_machine").text(machine_name);


				var calc = new propCluc();

				calc.setProp(gamecnt,regcnt,bigcnt,assetVal,select_machine);
				$(".big_probabilty").text(calc.bigPro);
				$(".reg_probabilty").text(calc.regPro);
				$(".com_probabilty").text(calc.comPro);
        $(".grape_probabilty").text(calc.grapePro);
        $(".roi").text(calc.roi);

				$(".result").show();

				
				$(".result").show();
			}else{
				
				//異常系
				$(".error").show();
				if(select_errorFlg == 0){
					$(".machine_notselected").hide();
				}
				if(input_errorFlg == 0){
					$(".allgame_notinputed").hide();
				}
			}
		});
		
		$(".save-btn").click(function(){

			var machine_num = $(".machine_num").val();
			var select_errorFlg = 0;
			var input_errorFlg = 0;
			var bigcnt = $(".bigcnt").val();
			var regcnt = $(".regcnt").val();
			var gamecnt = $(".allgame").val();
			var assetVal = $(".asset").val();
			var select_machine = $("input[name='machine']:checked").attr('id');
			var machine_name_index = $("input[name='machine']:checked").val();
			var machine_name_array = ["アイムジャグラーEX","MyジャグラーV","ファンキージャグラー2","ハッピージャグラー VIII","GOGOジャグラー 3"];
			//バリデーションチェック

			if(select_machine === undefined){
				select_errorFlg = 1;
			}

			if(gamecnt === "" || gamecnt <= 0){
				input_errorFlg = 1;
			}

			if(machine_num === "" || machine_num <= 0){
				machine_num = 0;
			}

			if(bigcnt === "" || bigcnt <= 0){
				bigcnt = 0;
			}

			if(regcnt === "" || regcnt <= 0){
				regcnt = 0;
			}

			if(assetVal === ""){
				assetVal = 0;
			}

			//正異常処理分岐

			if(select_errorFlg != 1 && input_errorFlg != 1){

				//正常系
				$(".error").hide();
				machine_name = machine_name_array[machine_name_index];
				$(".select_machine").text(machine_name);

				var calc = new propCluc();

				calc.setProp(gamecnt,regcnt,bigcnt,assetVal,select_machine);
			}

			var currentDate = new Date();
        
			// 月、日、時間、分、秒を取得
			var month = String(currentDate.getMonth() + 1).padStart(2, '0');
			var day = String(currentDate.getDate()).padStart(2, '0');
			var hours = String(currentDate.getHours()).padStart(2, '0');
			var minutes = String(currentDate.getMinutes()).padStart(2, '0');
			var seconds = String(currentDate.getSeconds()).padStart(2, '0');
		
			// フォーマット 'MM/DD hh:mm:ss' に変換
			var formattedDate = hours + ':' + minutes;

			var newHistory = $('<tr>')
				.append($('<td>').text(formattedDate))
				.append($('<td>').text(machine_num))
				.append($('<td>').text(gamecnt))
				.append($('<td>').text(bigcnt))
				.append($('<td>').text(regcnt))
				.append($('<td>').text(assetVal))
				.append($('<td>').text(calc.bigPro))
				.append($('<td>').text(calc.regPro))
				.append($('<td>').text(calc.comPro))
				.append($('<td>').text(calc.grapePro))
			
			$('.history-tbl tbody').append(newHistory);
			$('.history-tbl').show();

		})

		class propCluc{

			constractor(){
				this.machineName;
				this.regPro;
				this.bigPro;
				this.comPro;
        this.grapePro;
        this.roi;
			}

			setProp(gameCnt,regCnt,bigCnt,assetVal,machineName){
				let grape;
				if(regCnt > 0){
					this.regPro = gameCnt / regCnt;
					this.regPro = "1/" + this.regPro.toFixed(1);
				}else{
					this.regPro = "-";
				}

				if(bigCnt > 0){
					this.bigPro = gameCnt / bigCnt;
					this.bigPro = "1/" + this.bigPro.toFixed(1);
				}else{
					this.bigPro = "-";
				}

				if(regCnt != 0 || bigCnt != 0){
					this.comPro = gameCnt  / (parseInt(regCnt) + parseInt(bigCnt));
					this.comPro = "1/" + this.comPro.toFixed(1);
				}else{
					this.comPro = "-";
				}

				switch(machineName){
					case "im":
						grape = gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*251.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.040475))))/8)-(gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*251.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.040475))))/8)*2)
						break;
					case "my":
						grape = gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*239.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.04228))))/8)-(gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*239.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.04228))))/8)*2)
						break;
					case "funky":
						grape = gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*239.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.04324))))/8)-(gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*239.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.04324))))/8)*2)
						break;
					case "happy":
						grape = gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*251.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.040475))))/8)-(gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*251.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.040475))))/8)*2)
						break;
					case "gogo":
						grape = gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*251.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.040475))))/8)-(gameCnt/(((assetVal-(assetVal*2))-((gameCnt*3)-((bigCnt*251.25)+(regCnt*95.25)+(gameCnt*0.411)+(gameCnt*0.040475))))/8)*2)
						break;
				}

        this.grapePro = "1/" + grape.toFixed(3);
        
        this.roi = (1 + (assetVal / 3) / gameCnt) * 100;

        this.roi = this.roi.toFixed(2) + "%";

			}
		}
	})
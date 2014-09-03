$(document).ready(function()
{
	$(".defaultText").focus(function()
		{
			$(".count").css("visibility","visible");
			if ($(this).val() == $(this)[0].title)
			{
				$(this).addClass("defaultTextActive");
				$(this).val("");
			}
		});


	$(".defaultText").blur(function()
		{
			if ($(this).val() == "")
			{
				$(this).removeClass("defaultTextActive");
				$(this).val($(this)[0].title);
				$(".count").css("visibility","hidden");
				$(".count").text("4");				
			}
		});
	$(".defaultText").blur();		
		
	$("#data-form .button").click(function(){
		if($(".defaultText").val()==$(".defaultText").attr("title"))
		{
			ShowAlert("Please enter the security ticker or name.");
			return false;
		}
		$("div.alert").css("visibility","hidden");
		addSecurity();
	});
	
	$("input.defaultText").keydown(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode==13){
			event.preventDefault();
			if($(this).val()=="")
			{
				ShowAlert("Please enter the security ticker or name.");
				return false;
			}
			$("div.alert").css("visibility","hidden");			
			addSecurity();
		}		
	});
	
	$("input.defaultText").keyup(function(){
		var input = $(this).val();
		var count= 4-input.length;
		$(".count").text(count);
	});
});

function ShowAlert(alertStr){
	$("div.alert").html(alertStr);
	$("div.alert").css("visibility","visible");
}

function addSecurity()
{
	var secId = $(".defaultText").val();	
	/*validate security*/ 
	var exist = false;
	$("#data-table tr td:first-child").each(function(index){
		if($(this).html() == secId){			
			exist = true;
		//	return false;
		}
	});
	
	if(exist)
	{
		ShowAlert("You have added the security.");
	//	return;
	}else{
		/*do the calculations*/ 
		var price = (Math.random()*90+10).toFixed(2);
		var priceChange = ((Math.random()*2-1)*5).toFixed(2);
		var percentChange = (priceChange * 100 / (price - priceChange)).toFixed(2);
		var volume = Math.round(Math.random()*9000000+1000000);
	
		if(($("#data-table tbody tr").length ==0) || (parseFloat(parse($("td",$("#data-table tbody tr").last()).eq(3).html())) > parseFloat(percentChange))){
			/*do the animations*/ 
			doAnimations($("#data-table tbody tr").length, formatInsertString(secId, price, priceChange, percentChange, volume), $("#data-table tbody"), true);		
		}else{
				$("#data-table tbody tr").each(function(index){				
					if(parseFloat(parse($("td",this).eq(3).html())) <= parseFloat(percentChange)){
						/*do the animations*/ 				
						doAnimations(index, formatInsertString(secId, price, priceChange, percentChange, volume), $(this), false);
						return false;
					}
				});
			}
		}
		
}

function doAnimations(location, formattedStr, currentObj, append)
{
	$(".type").text($(".defaultText").val());
	$(".type").css("visibility","visible");
	var distance=126+40*location;
	$(".type").animate({top: distance},500,function(){
		$(".type").css("top","10px");
		$(".type").css("left","10px");
		$(".type").val("");
		$(".type").css("visibility","hidden");	
		if(append) 
			$(currentObj).append(formattedStr) 
		else
			$(currentObj).before(formattedStr);
		$(".new td").each(function(index){
			$(this).delay(50*index).fadeIn();
		});
		$(".new").animate({backgroundColor: '#f4f4f4'},1000,function(){
			$(this).removeClass("new");
		});
	});
	$(".defaultText").val("");	
	$(".defaultText").blur();
}

function formatInsertString(sec, p, pc, ptc, v){
	var str = "<tr class='new'><td>" + sec + "</td><td>" + p + (pc>=0? "</td><td class='plus'>" + (pc==0? "":"+") : "</td><td class='minus'>") + pc.toString() + (ptc>=0? "</td><td class='plus'>"+ (ptc==0? "":"+") : "</td><td class='minus'>") + ptc.toString() + "%</td><td>" + number_format(v) + "</td></tr>";
	return str;
}

function parse(percent)
{
	if(percent.indexOf('+')==0){
		return percent.substring(1,percent.length-1);
	}
	return percent.substring(0,percent.length-1);
}

function number_format(number, decimals, dec_point, thousands_sep) {    
    var n = !isFinite(+number) ? 0 : +number, 
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
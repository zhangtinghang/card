(function($, window, document){
	//获取所有的dom节点
	var sliderList = document.getElementsByClassName('mui-control-item');
	//获取DIV宽度
	var SLIDER_WIDTH = sliderList[0].offsetWidth;
	//获取屏幕宽度
	var viewWidth = document.body.scrollWidth;
	//同屏排列个数
	var SLIDER_LIST_NUM = parseInt(viewWidth/SLIDER_WIDTH);
	//中心点下标(从0开始)
	var SLIDER_LIST_HARF =  parseInt((SLIDER_LIST_NUM - 1)/2);
	
	var mui_scroll = document.getElementById("mui-scroll");
	var rightSlider = mui_scroll.scrollWidth - viewWidth;

	//判断是否超过一屏
	if(rightSlider < 0){
		rightSlider = 0;
		SLIDER_WIDTH = 0;
	}
	
	var sliderNodeEnd = sliderList.length - SLIDER_LIST_NUM + SLIDER_LIST_HARF;
	//阻尼系数
	var deceleration = $.os.ios?0.003:0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: true,
		indicators: true, //是否显示滚动条
		deceleration:deceleration
	});
	$('.mui-scroll').on('tap','a',function(){
		var href = this.getAttribute('href');
		console.log(href)
		if(href < 2){
			$('#mui-scroll-wrapper').scroll().scrollTo(0,0,500);//100毫秒滚动到顶
		}else if(href > sliderNodeEnd){
			var index = -rightSlider;
			$('#mui-scroll-wrapper').scroll().scrollTo(index,0,500);//100毫秒滚动到顶
		}else if(href == sliderNodeEnd){
			var index = -rightSlider;
			$('#mui-scroll-wrapper').scroll().scrollTo(index,0,500);//100毫秒滚动到顶
		}else{
			var index = -(SLIDER_WIDTH *(href-2));
			$('#mui-scroll-wrapper').scroll().scrollTo(index,0,500);//100毫秒滚动到顶
		}
	})
})(mui, window, document);

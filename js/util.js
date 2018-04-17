var util = {
	options: {
		ACTIVE_COLOR: "#fea000",
		NORMAL_COLOR: "#46495b",
		subpages: ["pages/company.html","pages/my_self.html"]
	},
	/**
	 *  简单封装了绘制原生view控件的方法
	 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	 */
	drawNative: function(id, styles, tags) {
		var view = new plus.nativeObj.View(id, styles, tags);
		return view;
	},
	/**
	 * 初始化首个tab窗口 和 创建子webview窗口 
	 */
	initSubpage: function(aniShow) {
		var subpage_style = {
				top: 0,
				bottom: 44,
				animationOptimization: "none",
				plusrequire:"ahead",
				render:"always",
				scrollIndicator:'none',
				softinputMode:'adjustResize'
			},
			
			subpages = util.options.subpages,
			self = plus.webview.currentWebview(),
			temp = {};


			
		//兼容安卓上设置沉浸式模式会遮盖子webview内容
		if(mui.os.android || mui.os.ios) {
			if(plus.navigator.isImmersedStatusbar()) {
				subpage_style.top += plus.navigator.getStatusbarHeight();
			}
		}

		// 初始化第一个tab项为首次显示
		temp[self.id] = "true";
		mui.extend(aniShow, temp);
		// 初始化绘制首个tab按钮
		util.toggleNview(0);

		for(var i = 0, len = subpages.length; i < len; i++) {
			if(!plus.webview.getWebviewById(subpages[i])) {	
					var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);					
				// append到当前父webview
				//延迟插入 避免渲染不出问题
				setTimeout(function(){
					sub.hide();
					self.append(sub);
				},50)					
			}
		}
	},
	/**	
	 * 点击切换tab窗口 
	 */
	changeSubpage: function(targetPage, activePage, aniShow) {
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetPage]) {
			plus.webview.show(targetPage);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetPage] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetPage, "fade-in", 300);
		}
		//隐藏当前 除了第一个父窗口
		if(activePage !== plus.webview.getLaunchWebview()) {
			plus.webview.hide(activePage);
		}
	},
	/**
	 * 点击重绘底部tab （view控件）
	 */
	toggleNview: function(currIndex) {
		currIndex = currIndex * 2;
		// 重绘当前tag 包括icon和text，所以执行两个重绘操作
		util.updateSubNViewIcon(currIndex, 'active');
		util.updateSubNView(currIndex + 1, util.options.ACTIVE_COLOR);
		// 重绘兄弟tag 反之排除当前点击的icon和text
		for(var i = 0; i < 6; i++) {
			if(i !== currIndex && i !== currIndex + 1) {
				if(i == 0 || i == 2 ||i==4){
					util.updateSubNViewIcon(i, 'normal');
				}else{
					util.updateSubNView(i, util.options.NORMAL_COLOR);
				}
				
			}
		}
	},
	/*
	 * 改变颜色
	 */
	changeColor: function(obj, color) {
		obj.color = color;
		return obj;
	},
	/*
	 * 改变图片
	 */
	changeSrc: function(obj, currIndex, flag) {
//		console.log('这是原来的路径',obj,'这是当前点击',currIndex,'这是状态',flag);
		if(currIndex == 0){
			if(flag === 'active'){
				obj = '_www/images/main/card_hover.png';
			}else{
				obj = '_www/images/main/card.png';
			}
		}else if(currIndex == 2){
			if(flag === 'active'){
				obj = '_www/images/main/company_hover.png';
			}else{
				obj = '_www/images/main/company.png';
			}
		}else if(currIndex == 4){
			if(flag === 'active'){
				obj = '_www/images/main/my_hover.png';
			}else{
				obj = '_www/images/main/my.png';
			}
		}
//		obj =obj+ src;
		return obj;
	},
	/*
	 * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	 */
	updateSubNView: function(currIndex, color) {
		var self = plus.webview.currentWebview(),
			nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
			nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
			currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag
		nviewEvent.drawText(currTag.text, currTag.position, util.changeColor(currTag.textStyles, color), currTag.id);
	},
	/*
	 * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	 */
	updateSubNViewIcon: function(currIndex,flag) {
		var self = plus.webview.currentWebview(),
			nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
			nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
			currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag
		nviewEvent.drawBitmap(util.changeSrc(currTag.src, currIndex ,flag),currTag.sprite,currTag.position,currTag.id);
	}
};
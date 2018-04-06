(function(w){

document.addEventListener('plusready',function(){
	console.log("Immersed-UserAgent: "+navigator.userAgent);
},false);

var immersed = 0;
var ms=(/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
if(ms&&ms.length>=3){
	immersed=parseFloat(ms[2]);
}
w.immersed=immersed;
if(!immersed){
	return;
}
var t=document.getElementById('header');
var c=document.getElementById('content');
var bg=document.getElementById('body-bg');
//t&&(t.style.paddingTop=immersed+'px',t.style.background='-webkit-linear-gradient(top,rgba(215,75,40,1),rgba(215,75,40,0.8))',t.style.color='#FFF');
t&&(t.style.paddingTop=immersed+'px',t.style.height=t.offsetHeight+immersed+'px');
c&&(c.style.paddingTop=t.offsetHeight+'px');
bg&&(bg.style.height = bg.offsetHeight+immersed+'px');
})(window);
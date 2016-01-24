"use strict";document.addEventListener("touchstart",function(){},!0);var ua=navigator.userAgent,isClient=/souyidai/.test(ua),isWechat=/MicroMessenger/.test(ua),isiOS=/iPhone|iPad|iPod/.test(ua),isAndroid=/Android/.test(ua),isAndroid4_3=/Android 4.0|Android 4.1|Android 4.2|Android 4.3/.test(ua),version=ua.split("souyidai")[1]||"0",buildNo=parseFloat(version.replace(/(\d+\.\d+).(\d+)/,"$1$2")||0),getCookie=function(e){if(document.cookie.length>0){var t=document.cookie.indexOf(e+"=");if(-1!==t){t=t+e.length+1;var o=document.cookie.indexOf(";",t);return-1===o&&(o=document.cookie.length),unescape(document.cookie.substring(t,o))}}return""},_sydaccesstoken="",_uid="";isClient&&(_uid=getCookie("syd_auth_verify").split("|")[0],_sydaccesstoken=getCookie("syd_auth_verify").split("|")[1]);var parserUrl=function(e){var t=document.createElement("a");t.href=e;var o=function(e){if(!e)return{};var t={};e=e.slice(1).split("&");for(var o,i=0;i<e.length;i++)o=e[i].split("="),t[o[0]]=o[1];return t};return{protocol:t.protocol,host:t.host,hostname:t.hostname,pathname:t.pathname,search:o(t.search),hash:t.hash}},disBtn=function(e){e.attr("disabled",!0),e.addClass("btn-disabled")},enBtn=function(e){e.removeAttr("disabled"),e.removeClass("btn-disabled")},errorHandle=function(e){return 302==e.errorCode?e.hasOwnProperty("errorMessage")?(toastShow(e.errorMessage),setTimeout(function(){location.href=e.url},2e3),!1):(location.href=e.url,!1):0==e.errorCode?!0:(dialogHide(".dialog"),toastShow(e.errorMessage),!1)};$(document).on("ajaxBeforeSend",function(e,t,o){""!==_sydaccesstoken&&(t.setRequestHeader("sydaccesstoken",_sydaccesstoken),t.setRequestHeader("uid",_uid))}),$(".form-group .form-control").on("focus",function(){$(this).parent().addClass("form-active").removeClass("has-error")}),$(".form-group .form-control").on("blur",function(){$(".form-group").removeClass("form-active")}),$(".form-group .input-icon").on("click",function(){$(this).parent().find(".form-control").val("").focus()});var dialogShow=function(e){var t=$(e),o=$(".dialog-back");o.show(),t.removeClass("dialog-close-am"),t.addClass("dialog-show-am"),t.show()},dialogHide=function(e){var t=$(e),o=$(".dialog-back");o.hide(),t.removeClass("dialog-show-am"),t.addClass("dialog-close-am");setTimeout(function(){t.hide()},300)};$(".dialog .close").on("click",function(e){e.stopPropagation(),dialogHide(".dialog.dialog-show-am")});var toastShow=function(e){var t=$(".toast"),o=.4*$(window).height()+$(window).scrollTop();if(!t.hasClass("toast-show-am")){t.parent().css("top",o),t.text(e),t.removeClass("toast-close-am"),t.addClass("toast-show-am"),t.show();setTimeout(function(){toastHide()},2500)}},toastHide=function(){var e=$(".toast");e.removeClass("toast-show-am"),e.addClass("toast-close-am");setTimeout(function(){e.hide()},300)},loaderShow=function(){$(".loader-back").show(),$(".loader").show()},loaderHide=function(){$(".loader-back").hide(),$(".loader").hide()};$(".icon-back").on("click",function(){history.back()});var drawCircle=function(e,t){var o=0,i=3,a=document.getElementById("arc");if(a){var n=document.getElementById("circle"),r=-e,s=n.getAttribute("r"),d=parseInt(t/i);t%i!==0&&d++;var c=function(){r-=i,r%=360;var c=r/180*Math.PI,u=n.getAttribute("cy")-Math.cos(c)*s,f=n.getAttribute("cx")-Math.sin(c)*s,g=a.getAttribute("d");if(0==o)var h=g+" M "+f+" "+u;else var h=g+" L "+f+" "+u;o===d&&window.clearInterval(l),a.setAttribute("d",h),o===d-1&&(r=-e-t),o++},l=setInterval(function(){c()},16)}},countDown=function(e,t){if(0!==t.length){var o=(new Date).getTime(),i=setInterval(function(){var a=(new Date).getTime(),n=new Date,r=e-(a-o);n.setTime(r+60*(new Date).getTimezoneOffset()*1e3);var s=n.getDate(),d=n.getHours()+24*(s-1);d=10>d?"0"+d:d;var c=n.getMinutes();c=10>c?"0"+c:c;var l=n.getSeconds();l=10>l?"0"+l:l;var u=d+"时"+c+"分"+l+"秒";t.text(u),0>r&&(window.clearInterval(i),t.parent().hasClass("dialog-header")?(t.parent().html("确认投资"),enBtn($("#bid-confirm"))):t.text("00时00分00秒"))},1e3);return i}},SYDBridge={androidConfig:{},iOSData:{},callBackMethod:{interestTicket:function(e){if(!e.hasOwnProperty("interestTicketId")&&!e.hasOwnProperty("id"))return localStorage.removeItem("interestTicket"),void $("#interestTicket").html('加息券 ><span class="tag-arrow orange-light"></span>');var t={title:document.title,item:e,uid:_uid};localStorage.setItem("interestTicket",JSON.stringify(t)),isAndroid&&(e.raiseInterestRate="+"+e.raiseInterestRate+"%"),$("#interestTicket").html(e.raiseInterestRate+' ><span class="tag-arrow orange-light"></span>')},sensor:function(e){ShakeEvent.devicemotion(e)}},openNative:function(e,t){var o=SYDBridge.addData(e,t);if(isiOS)location.hash=e+Math.random().toString(36).substring(2,12);else{var i=SYDBridge.androidConfig[e].prefix,a=SYDBridge.androidConfig[e].body;a.apply(i,o)}},addData:function(e,t){var o=JSON.stringify(t)||null;SYDBridge.iOSData[e]=o;var i=[];return null!==o&&i.push(o),i},nativeCallback:function(e){var t=e;"object"!=typeof e&&(t=JSON.parse(e)),SYDBridge.callBackMethod[t.key].call(SYDBridge.callBackMethod,t.data)}};isAndroid&&isClient&&(SYDBridge.androidConfig={callService:{prefix:tenderDetail,body:tenderDetail.callCustomerService},serviceOnline:{prefix:tenderDetail,body:tenderDetail.onlineCustomerService},doBid:{prefix:tenderDetail,body:tenderDetail.doBid},culator:{prefix:tenderDetail,body:tenderDetail.calculate},imageBrowser:{prefix:tenderDetail,body:tenderDetail.imageBrowser},webview:{prefix:window,body:function(e){/webViewUrl/.test(e)?location.href=JSON.parse(e).webViewUrl:location.href=e}},account:{prefix:rechargeAndWithdrawal,body:rechargeAndWithdrawal.finish},overview:{prefix:rechargeAndWithdrawal,body:rechargeAndWithdrawal.gotoMyMoney},share:{prefix:share,body:share.showShareDialog},route:{prefix:tenderDetail,body:tenderDetail.gotoFromWebActivity},interestTicket:{prefix:JsCommunication,body:JsCommunication.gotoSelectInterestTicket}}),isClient&&isAndroid&&buildNo>=43&&(SYDBridge.androidConfig.onMoneyChange={prefix:JsCommunication,body:JsCommunication.onMoneyChange}),isClient&&isAndroid&&buildNo>=45&&(SYDBridge.androidConfig.tipsAlert={prefix:JsCommunication,body:JsCommunication.tipsAlert}),isClient&&isAndroid&&buildNo>=46&&(SYDBridge.androidConfig.webview={prefix:JsCommunication,body:JsCommunication.webview}),isClient&&isAndroid&&buildNo>=48&&(SYDBridge.androidConfig.setClipBoard={prefix:JsCommunication,body:JsCommunication.setClipBoard}),window.onload=function(){"performance"in window&&"_paq"in window&&setTimeout(function(){var e=window.performance.timing,t=e.loadEventEnd-e.navigationStart;_paq.push(["trackEvent","pageLoadTime","pageLoadSuccess",location.pathname,t])},0)};
'use strict'
// ios button active hack
document.addEventListener('touchstart', function() {}, true);
// user agent
var ua = navigator.userAgent;
var isClient = /souyidai/.test(ua);
var isWechat = /MicroMessenger/.test(ua);
var isiOS = /iPhone|iPad|iPod/.test(ua);
var isAndroid = /Android/.test(ua);
var isAndroid4_3 = /Android 4.0|Android 4.1|Android 4.2|Android 4.3/.test(ua);
var version = ua.split('souyidai')[1] || '0';
var buildNo = parseFloat(version.replace(/(\d+\.\d+).(\d+)/, '$1$2') || 0);

//cookie get
var getCookie = function(name) {
  if (document.cookie.length > 0) {
    var cStart = document.cookie.indexOf(name + '=');
    if (cStart !== -1) {
      cStart = cStart + name.length + 1;
      var cEnd = document.cookie.indexOf(';', cStart);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return '';
};
//global uid token
var _sydaccesstoken ='';
var _uid = '';
if (isClient) {
  _uid = getCookie('syd_auth_verify').split('|')[0];
  _sydaccesstoken = getCookie('syd_auth_verify').split('|')[1];
}

//url parse function
var parserUrl = function(url) {
  var a = document.createElement('a');
  a.href = url;

  var search = function(search) {
    if (!search) return {};

    var ret = {};
    search = search.slice(1).split('&');
    for (var i = 0, arr; i < search.length; i++) {
      arr = search[i].split('=');
      ret[arr[0]] = arr[1];
    }
    return ret;
  };
  return {
    protocol: a.protocol,
    host: a.host,
    hostname: a.hostname,
    pathname: a.pathname,
    search: search(a.search),
    hash: a.hash
  }
};
//ajax btn disable
var disBtn = function(obj) {
  obj.attr('disabled', true);
  obj.addClass('btn-disabled')
};
var enBtn = function(obj) {
  obj.removeAttr('disabled');
  obj.removeClass('btn-disabled')
};
//ajax error handle
var errorHandle = function(res) {
  if (res.errorCode == 302) {
    if (res.hasOwnProperty('errorMessage')) {
      toastShow(res.errorMessage);
      setTimeout(function() {
        location.href = res.url;
      }, 2000);
      return false;
    } else {
      location.href = res.url;
      return false;
    }
  }
  if (res.errorCode == 0) {
    return true;
  } else {
    dialogHide('.dialog');
    toastShow(res.errorMessage);
    return false;
  }
};
//ajax global setting

$(document).on('ajaxBeforeSend', function(e, xhr, options) {
  if (_sydaccesstoken !== '') {
    xhr.setRequestHeader('sydaccesstoken', _sydaccesstoken);
    xhr.setRequestHeader('uid', _uid)
  }
});
//form
$('.form-group .form-control').on('focus', function() {
  $(this).parent().addClass('form-active').removeClass('has-error');
});
$('.form-group .form-control').on('blur', function() {
  $('.form-group').removeClass('form-active');
});
$('.form-group .input-icon').on('click', function() {
  $(this).parent().find('.form-control').val('').focus();
});
//dialog
var dialogShow = function(selector) {
  var dialog = $(selector);
  var dialogBack = $('.dialog-back');

  dialogBack.show();
  dialog.removeClass('dialog-close-am');
  dialog.addClass('dialog-show-am');
  dialog.show();
};
var dialogHide = function(selector) {
  var dialog = $(selector);
  var dialogBack = $('.dialog-back');

  dialogBack.hide();
  dialog.removeClass('dialog-show-am');
  dialog.addClass('dialog-close-am');
  var delayClose = setTimeout(function() {
    dialog.hide();
  }, 300)
};
$('.dialog .close').on('click', function(event) {
  event.stopPropagation();
  dialogHide('.dialog.dialog-show-am');
});
//toast
var toastShow = function(text) {
  var toast = $('.toast');
  var top = ($(window).height() * 0.4) + $(window).scrollTop();
  if (toast.hasClass('toast-show-am')) {
    return;
  }
  toast.parent().css('top', top);
  toast.text(text);
  toast.removeClass('toast-close-am');
  toast.addClass('toast-show-am');
  toast.show();
  var autoHide = setTimeout(function() {
    toastHide();
  }, 2500);
};
var toastHide = function() {
  var toast = $('.toast');
  toast.removeClass('toast-show-am');
  toast.addClass('toast-close-am');
  var delayClose = setTimeout(function() {
    toast.hide();
  }, 300)
};
//loader
var loaderShow = function() {
  $('.loader-back').show();
  $('.loader').show();
};
var loaderHide = function() {
  $('.loader-back').hide();
  $('.loader').hide();
};
//icon-back
$('.icon-back').on('click', function() {
  history.back();
});
//circle draw
var drawCircle = function(startAngle, targetAngle) {
  var i = 0;
  var step = 3;
  var arc = document.getElementById('arc');
  if (!arc) {
    return;
  }
  var circle = document.getElementById('circle');
  var angle = -startAngle;
  var radius = circle.getAttribute('r');
  var time = parseInt(targetAngle / step);
  if (targetAngle % step !== 0) {
    time++;
  }
  var arcUpdate = function() {
    angle -= step;
    angle %= 360;
    var radians = (angle / 180) * Math.PI;
    var y = circle.getAttribute('cy') - Math.cos(radians) * radius;
    var x = circle.getAttribute('cx') - Math.sin(radians) * radius;
    var e = arc.getAttribute('d');
    if (i == 0) {
      var d = e + ' M ' + x + ' ' + y;
    } else {
      var d = e + ' L ' + x + ' ' + y;
    }
    if (i === time) {
      window.clearInterval(arcTimer);
    }
    arc.setAttribute('d', d);
    if (i === time - 1) {
      angle = -startAngle - targetAngle;
    }
    i++;
  }
  var arcTimer = setInterval(function() {
    arcUpdate();
  }, 16);
};
//倒计时
var countDown = function(leftTime, el) {
  if (el.length === 0) {
    return;
  }
  var startTime = new Date().getTime();
  var countDownTimer = setInterval(function() {
    var nowTime = new Date().getTime();
    var nowLeftTime = new Date();
    var timeDiff = leftTime - (nowTime - startTime);
    nowLeftTime.setTime(timeDiff + (new Date().getTimezoneOffset() * 60 * 1000));
    var day = nowLeftTime.getDate();
    var hour = nowLeftTime.getHours() + (day - 1) * 24;
    hour = hour < 10 ? '0' + hour : hour;
    var min = nowLeftTime.getMinutes();
    min = min < 10 ? '0' + min : min;
    var sec = nowLeftTime.getSeconds();
    sec = sec < 10 ? '0' + sec : sec;
    var timeStr = hour + '时' + min + '分' + sec + '秒';
    el.text(timeStr);
    if (timeDiff < 0) {
      window.clearInterval(countDownTimer);
      if (el.parent().hasClass('dialog-header')) {
        el.parent().html('确认投资');
        enBtn($('#bid-confirm'));
      } else {
        el.text('00时00分00秒');
      }
    }
  }, 1000);
  return countDownTimer;
};
//native bridge
var SYDBridge = {
  androidConfig: {},
  iOSData: {},
  callBackMethod: {
    interestTicket: function(data) {
      if (!data.hasOwnProperty('interestTicketId') && !data.hasOwnProperty('id')) {
        localStorage.removeItem('interestTicket');
        $('#interestTicket').html('加息券 ><span class="tag-arrow orange-light"></span>');
        return;
      }
      var interestTicketSelect = {
        title: document.title,
        item: data,
        uid: _uid
      };
      localStorage.setItem('interestTicket', JSON.stringify(interestTicketSelect));
      if (isAndroid) {
        data.raiseInterestRate = '+' + data.raiseInterestRate + '%';
      }
      $('#interestTicket').html(data.raiseInterestRate + ' ><span class="tag-arrow orange-light"></span>');
    },
    sensor: function(data) {
      ShakeEvent.devicemotion(data);
    }
  },
  openNative: function(method, data) {
    var args = SYDBridge.addData(method, data);
    if (isiOS) {
      location.hash = method + Math.random().toString(36).substring(2, 12);
    } else {
      var funPrefix = SYDBridge.androidConfig[method].prefix;
      var funBody = SYDBridge.androidConfig[method].body;
      funBody.apply(funPrefix, args);
    }
  },
  addData: function(key, data) {
    var JSONData = JSON.stringify(data) || null;
    SYDBridge.iOSData[key] = JSONData;
    var args = [];
    if (JSONData !== null) {
      args.push(JSONData);
    }
    return args;
  },
  nativeCallback: function(data) {
    var result = data;
    if (typeof data !== 'object') {
      result = JSON.parse(data);
    }
    SYDBridge.callBackMethod[result.key].call(SYDBridge.callBackMethod, result.data);
  }
};
if (isAndroid && isClient) {
  SYDBridge.androidConfig = {
    callService: {
      prefix: tenderDetail,
      body: tenderDetail.callCustomerService
    },
    serviceOnline: {
      prefix: tenderDetail,
      body: tenderDetail.onlineCustomerService
    },
    doBid: {
      prefix: tenderDetail,
      body: tenderDetail.doBid
    },
    culator: {
      prefix: tenderDetail,
      body: tenderDetail.calculate
    },
    imageBrowser: {
      prefix: tenderDetail,
      body: tenderDetail.imageBrowser
    },
    webview: {
      prefix: window,
      body: function(url) {
        if (/webViewUrl/.test(url)) {
          location.href = JSON.parse(url).webViewUrl;
        } else {
          location.href = url
        }
      }
    },
    account: {
      prefix: rechargeAndWithdrawal,
      body: rechargeAndWithdrawal.finish
    },
    overview: {
      prefix: rechargeAndWithdrawal,
      body: rechargeAndWithdrawal.gotoMyMoney
    },
    share: {
      prefix: share,
      body: share.showShareDialog
    },
    route: {
      prefix: tenderDetail,
      body: tenderDetail.gotoFromWebActivity
    },
    interestTicket: {
      prefix: JsCommunication,
      body: JsCommunication.gotoSelectInterestTicket
    }
  };
}
if (isClient && isAndroid && buildNo >= 43) {
  SYDBridge.androidConfig.onMoneyChange = {
    prefix: JsCommunication,
    body: JsCommunication.onMoneyChange
  };
}
if (isClient && isAndroid && buildNo >= 45) {
  SYDBridge.androidConfig.tipsAlert = {
    prefix: JsCommunication,
    body: JsCommunication.tipsAlert
  };
};
if (isClient && isAndroid && buildNo >= 46) {
  SYDBridge.androidConfig.webview = {
    prefix: JsCommunication,
    body: JsCommunication.webview
  };
};
if (isClient && isAndroid && buildNo >= 48) {
  SYDBridge.androidConfig.setClipBoard = {
    prefix: JsCommunication,
    body: JsCommunication.setClipBoard
  };
};
//测试页面performance
window.onload = function() {
  if ('performance' in window && '_paq' in window) {
    setTimeout(function() {
      var perfData = window.performance.timing;
      var pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      _paq.push(['trackEvent', 'pageLoadTime', 'pageLoadSuccess', location.pathname, pageLoadTime]);
    }, 0);
  }
};

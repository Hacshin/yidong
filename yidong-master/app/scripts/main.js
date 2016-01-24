'use strict';

function initPage() {

  document.body.addEventListener('touchstart', function(e) {
    e = e.changedTouches[0];
    onStart(e);
  });
  document.body.addEventListener('touchmove', function(e) {
    onMove(e.changedTouches[0], e);
  });
  document.body.addEventListener('touchend', function(e) {
    onEnd(e.changedTouches[0]);
  });
  // 翻转的绑定
  window.onorientationchange = orientationChange;

  pageWidth = $(window).width();
  pageHeight = $('.container').height();
  pages = $('.container section');
  //$('.bg .bg_sec').css('height', pageHeight);
  //var bg_sec_height = $('.bg .bg_sec').height();

  $('.container section').css({
    'width': pageWidth + 'px', //'height':$('.container').height()+'px'
    'height': pageHeight + 'px',
  });
  secHeight = pageHeight * $('.container section').length;
  lineHeight = 832 * secHeight / pageHeight;
  $('.sec, .line').addClass('drag');
  animatePage(curPage);
  $('.page-loading').removeClass('page-loading');
}

function orientationChange() {
  var delay = setTimeout(function() {
    initPage();
  }, 500);
};
// 以下是拖动效果
var startX = 0,
  startY = 0;
var margin = 0;
var pages = null;
var curPage = 0;
var pageWidth = 0,
  pageHeight = 0;
var lineHeight = 0,
  secHeight = 0;
var targetElement = null;
var scrollPrevent = false,
  movePrevent = false,
  touchDown = false;
var num = null;
var curNum = 0;

function onStart(e) {
  if (movePrevent == true) {
    event.preventDefault();
    return false;
  }

  touchDown = true;

  // 起始点，页面位置
  startX = e.pageX;
  startY = e.pageY;
  $('.sec, .line').addClass('drag');
  margin = $('.sec').css('-webkit-transform');
  margin = margin.replace('matrix(', '');
  margin = margin.replace(')', '');
  margin = margin.split(',');
  margin = parseInt(margin[5]);
}

function onMove(e, oe) {
  if (movePrevent == true || touchDown != true) {
    event.preventDefault();
    return false;
  }
  event.preventDefault();
  if (scrollPrevent == false && e.pageY != startY) {
    var temp = margin + e.pageY - startY;
    $('.sec').css('-webkit-transform', 'matrix(1, 0, 0, 1, 0, ' + temp + ')');
    var b = lineHeight / secHeight * temp;
    $('.line').css('-webkit-transform', 'matrix(1, 0, 0, 1, 0, ' + b + ')');
  }
}

function onEnd(e) {
  if (movePrevent == true) {
    event.preventDefault();
    return false;
  }
  touchDown = false;
  if (scrollPrevent == false) {
    // 抬起点，页面位置
    var endX = e.pageX;
    var endY = e.pageY;
    // swip 事件默认大于50px才会触发，小于这个就将页面归回
    if (Math.abs(endY - startY) <= 60) {
      animatePage(curPage);
    } else {
      if (endY > startY) {
        prevPage();
      } else {
        nextPage();
      }
    }
  }
  $('.sec, .line').removeClass('drag');
}

function prevPage() {
  var newPage = curPage - 1;
  animatePage(newPage);
}

function nextPage() {
  var newPage = curPage + 1;
  animatePage(newPage);
}

function animatePage(newPage) {
  if (newPage < 0) {
    newPage = 0;
  }
  if (newPage > $('.container section').length - 1) {
    newPage = $('.container section').length - 1;
  }

  curPage = newPage;
  var newMarginTop = newPage * (-pageHeight);
  $('.sec').css({
    '-webkit-transform': 'matrix(1, 0, 0, 1, 0, ' + newMarginTop + ')'
  });

  var newTop = -parseInt(curPage * pageHeight * (lineHeight / secHeight));
  $('.line').css({
    '-webkit-transform': 'matrix(1, 0, 0, 1, 0, ' + newTop + ')'
  });
  //alert(curPage);
  movePrevent = true;
  setTimeout('movePrevent=false;', 500);

  // 每页动画
  if (!$(pages[curPage]).hasClass('sec0' + (curPage + 1) + '-show')) {
    $(pages[curPage]).addClass('sec0' + (curPage + 1) + '-show');
    $(pages[curPage]).addClass('sec-show');
  }
  $(pages[curPage - 1]).removeClass('sec0' + (curPage) + '-show');
  $(pages[curPage - 1]).removeClass('sec-show');
  $(pages[curPage + 1]).removeClass('sec0' + (curPage + 2) + '-show');
  $(pages[curPage + 1]).removeClass('sec-show');
}

var WX_DEFAULT_SHARE = {
  'title': 'title',
  'desc': 'desc',
  'timelineDesc': 'title',
  'imgUrl': '',
  'link': ''
};

function initShare() {
  if (isWechat) {
    $.ajax({
      url: '/serve/jssign',
      type: 'GET',
      dataType: 'json',
      data: {
        url: location.href
      },
      success: function(res) {
        if (res.errorCode === 0) {
          wx.config(res.result);
        }
      }
    });
    wx.ready(function() {
      wx.onMenuShareTimeline({
        title: WX_DEFAULT_SHARE.timelineDesc,
        link: WX_DEFAULT_SHARE.link,
        imgUrl: WX_DEFAULT_SHARE.imgUrl,
        success: function() {
          _paq.push(['trackEvent', 'timemachine', 'share', 'timeline']);
          $('.share-overlay').hide();
        }
      });
      wx.onMenuShareAppMessage({
        title: WX_DEFAULT_SHARE.title,
        desc: WX_DEFAULT_SHARE.desc,
        link: WX_DEFAULT_SHARE.link,
        imgUrl: WX_DEFAULT_SHARE.imgUrl,
        success: function() {
          _paq.push(['trackEvent', 'timemachine', 'share', 'message']);
          $('.share-overlay').hide();
        }
      });
    });
  }
}

$(function() {
  $('.btn-1').on('click', function() {
    location.href = 'https://www.baidu.com';
  });
  $('.btn-2').on('click', function() {
    location.href = 'https://www.baidu.com';
  });
  $('.btn-3').on('click', function() {
    location.href = 'https://www.baidu.com';
  });
  initPage();
});

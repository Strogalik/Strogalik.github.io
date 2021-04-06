'use strict';

// ДЛЯ КАРТЫ
var map = document.querySelector('.map__wrapper');

// ДЛЯ СЛАЙДЕРА
var MAX_PERCENT = 100;
var TOUCH_TRACK = 70;
var TABLE_MAX_WIDTH = 1199;
var MOBILE_MAX_WIDTH = 767;

var slidersList = [];
var sliders = document.querySelectorAll('.slider');

// ПОЛИФИЛ ДЛЯ object-fit
window.objectFitImages();

// КОД СЛАЙДЕРА
// Сборка объекьа слайдера
for (var i = 0; i < sliders.length; i++) {
  var slider = {};
  slider.slider = sliders[i];
  slider.sliderList = sliders[i].querySelector('.slider__list');
  slider.slides = sliders[i].querySelectorAll('.slider__item');
  slider.sliderPrev = sliders[i].querySelector('.slider__prev');
  slider.sliderNext = sliders[i].querySelector('.slider__next');
  slider.dots = sliders[i].querySelector('.slider__dot-list');
  slider.dotsList = sliders[i].querySelectorAll('.slider__dot');
  slider.step = slider.slides.length - sliders[i].querySelectorAll('.slider__item--hide').length;
  if (window.matchMedia('(max-width: ' + TABLE_MAX_WIDTH + 'px)').matches) {
    --slider.step;
  }
  if (window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches) {
    slider.step = 1;
  }
  slidersList[i] = slider;
}

// Инициализация и логика слайдера
slidersList.forEach(function (el) {
  function initSlider() {
    var sliderWidth = 0;
    for (var z = 0; z < el.slides.length; z++) {
      sliderWidth += el.slides[z].offsetWidth;
    }
    el.sliderList.style.width = '' + sliderWidth + 'px';
  }

  function nextSlide() {
    openSlides(slideIndex += el.step);
  }

  function prevSlide() {
    openSlides(slideIndex -= el.step);
  }

  function touchSlide() {
    el.sliderList.addEventListener('touchstart', function (evt) {
      var startCoords = evt.changedTouches[0].clientX;
      var endCoords = evt.changedTouches[0].clientX;

      var onMouseMove = function (moveEvt) {
        endCoords = moveEvt.changedTouches[0].clientX;
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        el.slider.removeEventListener('touchmove', onMouseMove);
        el.slider.removeEventListener('touchend', onMouseUp);
        var shift = startCoords - endCoords;
        if (Math.abs(shift) > TOUCH_TRACK) {
          if (shift > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      };

      el.slider.addEventListener('touchmove', onMouseMove);
      el.slider.addEventListener('touchend', onMouseUp);
      el.sliderPrev.addEventListener('touchstart', prevSlide);
      el.sliderNext.addEventListener('touchstart', nextSlide);
    });
  }

  function openSlides(n) {
    if (n > el.slides.length) {
      slideIndex = el.step;
    }
    if (n < 1) {
      slideIndex = el.slides.length;
    }

    slideIndex -= el.step;
    el.slides[0].style.marginLeft = '-' + MAX_PERCENT / el.slides.length * slideIndex + '%';
    slideIndex += el.step;
  }

  initSlider();
  var slideIndex = el.step;
  openSlides(slideIndex);

  el.sliderPrev.addEventListener('click', prevSlide);
  el.sliderNext.addEventListener('click', nextSlide);

  if (window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches) {
    touchSlide();
  }

});

// КАРТА
var mapCoord = [59.938635, 30.323118];
var mapCoordCenter = [59.938695, 30.323255];
var mapZoom = 17;
var mapIconImageOffset = [8, -152];

if (window.matchMedia('(max-width: ' + TABLE_MAX_WIDTH + 'px)').matches) {
  mapCoordCenter = [59.938595, 30.323355];
  mapZoom = 16;
  mapIconImageOffset = [-20, -59];

  if (window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches) {
    mapCoordCenter = [59.938855, 30.323955];
    mapZoom = 15;
    mapIconImageOffset = [-20, -59];
  }
}

if (map) {
  map.classList.add('map__wrapper--js');

  var init = function () {
    var myMap = new window.ymaps.Map('map', {
      center: mapCoordCenter,
      zoom: mapZoom,
      controls: ['smallMapDefaultSet']
    });

    var myPlacemark = new window.ymaps.Placemark(mapCoord, {
      hintContent: 'Эй, мы здесь!',
      balloonContent: 'Образовательный центр Clever Baby'
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map-pin.svg',
      iconImageSize: [32, 39],
      iconImageOffset: mapIconImageOffset
    });

    myMap.geoObjects.add(myPlacemark);

  };

  window.ymaps.ready(init);

}

/*! npm.im/object-fit-images 3.2.4 */
var objectFitImages=function(){"use strict";function t(t,e){return"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='"+t+"' height='"+e+"'%3E%3C/svg%3E"}function e(t){if(t.srcset&&!p&&window.picturefill){var e=window.picturefill._;t[e.ns]&&t[e.ns].evaled||e.fillImg(t,{reselect:!0}),t[e.ns].curSrc||(t[e.ns].supported=!1,e.fillImg(t,{reselect:!0})),t.currentSrc=t[e.ns].curSrc||t.src}}function i(t){for(var e,i=getComputedStyle(t).fontFamily,r={};null!==(e=u.exec(i));)r[e[1]]=e[2];return r}function r(e,i,r){var n=t(i||1,r||0);b.call(e,"src")!==n&&h.call(e,"src",n)}function n(t,e){t.naturalWidth?e(t):setTimeout(n,100,t,e)}function c(t){var c=i(t),o=t[l];if(c["object-fit"]=c["object-fit"]||"fill",!o.img){if("fill"===c["object-fit"])return;if(!o.skipTest&&f&&!c["object-position"])return}if(!o.img){o.img=new Image(t.width,t.height),o.img.srcset=b.call(t,"data-ofi-srcset")||t.srcset,o.img.src=b.call(t,"data-ofi-src")||t.src,h.call(t,"data-ofi-src",t.src),t.srcset&&h.call(t,"data-ofi-srcset",t.srcset),r(t,t.naturalWidth||t.width,t.naturalHeight||t.height),t.srcset&&(t.srcset="");try{s(t)}catch(t){window.console&&console.warn("https://bit.ly/ofi-old-browser")}}e(o.img),t.style.backgroundImage='url("'+(o.img.currentSrc||o.img.src).replace(/"/g,'\\"')+'")',t.style.backgroundPosition=c["object-position"]||"center",t.style.backgroundRepeat="no-repeat",t.style.backgroundOrigin="content-box",/scale-down/.test(c["object-fit"])?n(o.img,function(){o.img.naturalWidth>t.width||o.img.naturalHeight>t.height?t.style.backgroundSize="contain":t.style.backgroundSize="auto"}):t.style.backgroundSize=c["object-fit"].replace("none","auto").replace("fill","100% 100%"),n(o.img,function(e){r(t,e.naturalWidth,e.naturalHeight)})}function s(t){var e={get:function(e){return t[l].img[e?e:"src"]},set:function(e,i){return t[l].img[i?i:"src"]=e,h.call(t,"data-ofi-"+i,e),c(t),e}};Object.defineProperty(t,"src",e),Object.defineProperty(t,"currentSrc",{get:function(){return e.get("currentSrc")}}),Object.defineProperty(t,"srcset",{get:function(){return e.get("srcset")},set:function(t){return e.set(t,"srcset")}})}function o(){function t(t,e){return t[l]&&t[l].img&&("src"===e||"srcset"===e)?t[l].img:t}d||(HTMLImageElement.prototype.getAttribute=function(e){return b.call(t(this,e),e)},HTMLImageElement.prototype.setAttribute=function(e,i){return h.call(t(this,e),e,String(i))})}function a(t,e){var i=!y&&!t;if(e=e||{},t=t||"img",d&&!e.skipTest||!m)return!1;"img"===t?t=document.getElementsByTagName("img"):"string"==typeof t?t=document.querySelectorAll(t):"length"in t||(t=[t]);for(var r=0;r<t.length;r++)t[r][l]=t[r][l]||{skipTest:e.skipTest},c(t[r]);i&&(document.body.addEventListener("load",function(t){"IMG"===t.target.tagName&&a(t.target,{skipTest:e.skipTest})},!0),y=!0,t="img"),e.watchMQ&&window.addEventListener("resize",a.bind(null,t,{skipTest:e.skipTest}))}var l="fregante:object-fit-images",u=/(object-fit|object-position)\s*:\s*([-.\w\s%]+)/g,g="undefined"==typeof Image?{style:{"object-position":1}}:new Image,f="object-fit"in g.style,d="object-position"in g.style,m="background-size"in g.style,p="string"==typeof g.currentSrc,b=g.getAttribute,h=g.setAttribute,y=!1;return a.supportsObjectFit=f,a.supportsObjectPosition=d,o(),a}();
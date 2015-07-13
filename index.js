(function ($, window, document) {
  'use strict';

  // TIMEPICKER PUBLIC CLASS DEFINITION
  function Timepicker(element, options) {
    this.$element = $(element);
    this.defaultTime = options.defaultTime;
    this.disableFocus = options.disableFocus;
    this.disableMousewheel = options.disableMousewheel;
    this.minuteStep = options.minuteStep;
    this.secondStep = options.secondStep;
    this.showMeridian = options.showMeridian;
    this.showSeconds = options.showSeconds;
    this.showWidgetOnAddonClick = options.showWidgetOnAddonClick;

    this.$element.on({
      'focus.timepicker': $.proxy(this.highlightUnit, this),
      'click.timepicker': $.proxy(this.highlightUnit, this),
      'keydown.timepicker': $.proxy(this.elementKeydown, this),
      'blur.timepicker': $.proxy(this.blurElement, this),
      'mousewheel.timepicker DOMMouseScroll.timepicker': $.proxy(this.mousewheel, this)
    });

    this.setDefaultTime(this.defaultTime);
  }

  Timepicker.prototype = {

    constructor: Timepicker,

    blurElement: function () {
      this.highlightedUnit = null;
      this.updateFromElementVal();
    },

    clear: function () {
      this.hour = '';
      this.minute = '';
      this.second = '';
      this.meridian = '';

      this.$element.val('');
    },

    decrementHour: function () {
      var hour = this.hour;
      if (this.showMeridian) {
        if (hour === 1) {
          this.hour = 12;
          return;
        }
        if (hour === 12 || hour === 0) {
          this.hour = 11;
          this.toggleMeridian();
          return;
        }
        this.hour--;
        return;
      }
      if (hour <= 0) {
        this.hour = 23;
        return;
      }
      this.hour--;
    },

    decrementMinute: function (step) {
      var newVal = this.minute - (step || this.minuteStep);
      if (newVal < 0) {
        this.decrementHour();
        this.minute = newVal + 60;
      } else {
        this.minute = newVal;
      }
    },

    decrementSecond: function () {
      var newVal = this.second - this.secondStep;
      if (newVal < 0) {
        this.decrementMinute(1);
        this.second = newVal + 60;
      } else {
        this.second = newVal;
      }
    },

    elementKeydown: function (e) {
      switch (e.keyCode) {
      case 9: //tab
      case 27: // escape
        this.updateFromElementVal();
        break;
      case 37: // left arrow
        e.preventDefault();
        this.highlightPrevUnit();
        break;
      case 38: // up arrow
        e.preventDefault();
        switch (this.highlightedUnit) {
        case 'hour':
          this.incrementHour();
          this.highlightHour();
          break;
        case 'minute':
          this.incrementMinute();
          this.highlightMinute();
          break;
        case 'second':
          this.incrementSecond();
          this.highlightSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          this.highlightMeridian();
          break;
        }
        this.update();
        break;
      case 39: // right arrow
        e.preventDefault();
        this.highlightNextUnit();
        break;
      case 40: // down arrow
        e.preventDefault();
        switch (this.highlightedUnit) {
        case 'hour':
          this.decrementHour();
          this.highlightHour();
          break;
        case 'minute':
          this.decrementMinute();
          this.highlightMinute();
          break;
        case 'second':
          this.decrementSecond();
          this.highlightSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          this.highlightMeridian();
          break;
        }

        this.update();
        break;
      }
    },

    getCursorPosition: function () {
      var input = this.$element.get(0);

      if ('selectionStart' in input) {// Standard-compliant browsers

        return input.selectionStart;
      } else if (document.selection) {// IE fix
        input.focus();
        var sel = document.selection.createRange(),
          selLen = document.selection.createRange().text.length;

        sel.moveStart('character', -input.value.length);

        return sel.text.length - selLen;
      }
    },

    getTime: function () {
      if (this.hour === '') {
        return '';
      }

      return this.hour + ':' + (this.minute.toString().length === 1 ? '0' + this.minute : this.minute) + (this.showSeconds ? ':' + (this.second.toString().length === 1 ? '0' + this.second : this.second) : '') + (this.showMeridian ? ' ' + this.meridian : '');
    },

    highlightUnit: function () {
      this.position = this.getCursorPosition();
      if (this.position >= 0 && this.position <= 2) {
        this.highlightHour();
      } else if (this.position >= 3 && this.position <= 5) {
        this.highlightMinute();
      } else if (this.position >= 6 && this.position <= 8) {
        if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMeridian();
        }
      } else if (this.position >= 9 && this.position <= 11) {
        this.highlightMeridian();
      }
    },

    highlightNextUnit: function () {
      switch (this.highlightedUnit) {
      case 'hour':
        this.highlightMinute();
        break;
      case 'minute':
        if (this.showSeconds) {
          this.highlightSecond();
        } else if (this.showMeridian) {
          this.highlightMeridian();
        } else {
          this.highlightHour();
        }
        break;
      case 'second':
        if (this.showMeridian) {
          this.highlightMeridian();
        } else {
          this.highlightHour();
        }
        break;
      case 'meridian':
        this.highlightHour();
        break;
      }
    },

    highlightPrevUnit: function () {
      switch (this.highlightedUnit) {
      case 'hour':
        if (this.showMeridian) {
          this.highlightMeridian();
        } else if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMinute();
        }
        break;
      case 'minute':
        this.highlightHour();
        break;
      case 'second':
        this.highlightMinute();
        break;
      case 'meridian':
        if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMinute();
        }
        break;
      }
    },

    highlightHour: function () {
      var $element = this.$element.get(0),
        self = this;

      this.highlightedUnit = 'hour';

      if ($element.setSelectionRange) {
        setTimeout(function () {
          if (self.hour < 10) {
            $element.setSelectionRange(0, 1);
          } else {
            $element.setSelectionRange(0, 2);
          }
        }, 0);
      }
    },

    highlightMinute: function () {
      var $element = this.$element.get(0),
        self = this;

      this.highlightedUnit = 'minute';

      if ($element.setSelectionRange) {
        setTimeout(function () {
          if (self.hour < 10) {
            $element.setSelectionRange(2, 4);
          } else {
            $element.setSelectionRange(3, 5);
          }
        }, 0);
      }
    },

    highlightSecond: function () {
      var $element = this.$element.get(0),
        self = this;

      this.highlightedUnit = 'second';

      if ($element.setSelectionRange) {
        setTimeout(function () {
          if (self.hour < 10) {
            $element.setSelectionRange(5, 7);
          } else {
            $element.setSelectionRange(6, 8);
          }
        }, 0);
      }
    },

    highlightMeridian: function () {
      var $element = this.$element.get(0),
        self = this;

      this.highlightedUnit = 'meridian';

      if ($element.setSelectionRange) {
        if (this.showSeconds) {
          setTimeout(function () {
            if (self.hour < 10) {
              $element.setSelectionRange(8, 10);
            } else {
              $element.setSelectionRange(9, 11);
            }
          }, 0);
        } else {
          setTimeout(function () {
            if (self.hour < 10) {
              $element.setSelectionRange(5, 7);
            } else {
              $element.setSelectionRange(6, 8);
            }
          }, 0);
        }
      }
    },

    incrementHour: function () {
      if (this.showMeridian) {
        if (this.hour === 11) {
          this.hour++;
          this.toggleMeridian();
          return;
        } else if (this.hour === 12) {
          this.hour = 0;
        }
      }
      if (this.hour === 23) {
        this.hour = 0;
        return;
      }
      this.hour++;
    },

    incrementMinute: function (step) {
      var newVal = this.minute + (step || this.minuteStep - (this.minute % this.minuteStep));
      if (newVal > 59) {
        this.incrementHour();
        this.minute = newVal - 60;
      } else {
        this.minute = newVal;
      }
    },

    incrementSecond: function () {
      var newVal = this.second + this.secondStep - (this.second % this.secondStep);

      if (newVal > 59) {
        this.incrementMinute(1);
        this.second = newVal - 60;
      } else {
        this.second = newVal;
      }
    },

    mousewheel: function (e) {
      if (this.disableMousewheel) {
        return false;
      }

      e.preventDefault();
      e.stopPropagation();

      var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail,
        scrollTo = null;

      if (e.type === 'mousewheel') {
        scrollTo = (e.originalEvent.wheelDelta * -1);
      }
      else if (e.type === 'DOMMouseScroll') {
        scrollTo = 40 * e.originalEvent.detail;
      }

      if (scrollTo) {
        e.preventDefault();
        $(this).scrollTop(scrollTo + $(this).scrollTop());
      }

      switch (this.highlightedUnit) {
      case 'minute':
        if (delta > 0) {
          this.incrementMinute();
        } else {
          this.decrementMinute();
        }
        this.highlightMinute();
        break;
      case 'second':
        if (delta > 0) {
          this.incrementSecond();
        } else {
          this.decrementSecond();
        }
        this.highlightSecond();
        break;
      case 'meridian':
        this.toggleMeridian();
        this.highlightMeridian();
        break;
      default:
        if (delta > 0) {
          this.incrementHour();
        } else {
          this.decrementHour();
        }
        this.highlightHour();
        break;
      }

      return false;
    },

    remove: function () {
      $('document').off('.timepicker');
      delete this.$element.data().timepicker;
    },

    setDefaultTime: function (defaultTime) {
      if (!this.$element.val()) {
        if (defaultTime === 'current') {
          var dTime = new Date(),
            hours = dTime.getHours(),
            minutes = dTime.getMinutes(),
            seconds = dTime.getSeconds(),
            meridian = 'AM';

          if (seconds !== 0) {
            seconds = Math.ceil(dTime.getSeconds() / this.secondStep) * this.secondStep;
            if (seconds === 60) {
              minutes += 1;
              seconds = 0;
            }
          }

          if (minutes !== 0) {
            minutes = Math.ceil(dTime.getMinutes() / this.minuteStep) * this.minuteStep;
            if (minutes === 60) {
              hours += 1;
              minutes = 0;
            }
          }

          if (this.showMeridian) {
            if (hours === 0) {
              hours = 12;
            } else if (hours >= 12) {
              if (hours > 12) {
                hours = hours - 12;
              }
              meridian = 'PM';
            } else {
              meridian = 'AM';
            }
          }

          this.hour = hours;
          this.minute = minutes;
          this.second = seconds;
          this.meridian = meridian;

          this.update();

        } else if (!defaultTime) {
          this.hour = 0;
          this.minute = 0;
          this.second = 0;
          this.meridian = 'AM';
        } else {
          this.setTime(defaultTime);
        }
      } else {
        this.updateFromElementVal();
      }
    },

    setTime: function (time, ignoreWidget) {
      if (!time) {
        this.clear();
        return;
      }

      var timeArray,
        hour,
        minute,
        second,
        meridian;

      if (typeof time === 'object' && time.getMonth) {
        // this is a date object
        hour = time.getHours();
        minute = time.getMinutes();
        second = time.getSeconds();

        if (this.showMeridian) {
          meridian = 'AM';
          if (hour > 12) {
            meridian = 'PM';
            hour = hour % 12;
          }

          if (hour === 12) {
            meridian = 'PM';
          }
        }
      } else {
        if (time.match(/p/i) !== null) {
          meridian = 'PM';
        } else {
          meridian = 'AM';
        }

        time = time.replace(/[^0-9\:]/g, '');

        timeArray = time.split(':');

        hour = timeArray[0] ? timeArray[0].toString() : timeArray.toString();
        minute = timeArray[1] ? timeArray[1].toString() : '';
        second = timeArray[2] ? timeArray[2].toString() : '';

        // idiot proofing
        if (hour.length > 4) {
          second = hour.substr(4, 2);
        }
        if (hour.length > 2) {
          minute = hour.substr(2, 2);
          hour = hour.substr(0, 2);
        }
        if (minute.length > 2) {
          second = minute.substr(2, 2);
          minute = minute.substr(0, 2);
        }
        if (second.length > 2) {
          second = second.substr(2, 2);
        }

        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);
        second = parseInt(second, 10);

        if (isNaN(hour)) {
          hour = 0;
        }
        if (isNaN(minute)) {
          minute = 0;
        }
        if (isNaN(second)) {
          second = 0;
        }

        if (this.showMeridian) {
          if (hour < 1) {
            hour = 1;
          } else if (hour > 12) {
            hour = 12;
          }
        } else {
          if (hour >= 24) {
            hour = 23;
          } else if (hour < 0) {
            hour = 0;
          }
          if (hour < 13 && meridian === 'PM') {
            hour = hour + 12;
          }
        }

        if (minute < 0) {
          minute = 0;
        } else if (minute >= 60) {
          minute = 59;
        }

        if (this.showSeconds) {
          if (isNaN(second)) {
            second = 0;
          } else if (second < 0) {
            second = 0;
          } else if (second >= 60) {
            second = 59;
          }
        }
      }

      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.meridian = meridian;

      this.update(ignoreWidget);
    },

    toggleMeridian: function () {
      this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';
    },

    update: function () {
      this.updateElement();
      this.$element.trigger({
        'type': 'changeTime.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });
    },

    updateElement: function () {
      this.$element.val(this.getTime()).change();
    },

    updateFromElementVal: function () {
      this.setTime(this.$element.val());
    }
  };

  //TIMEPICKER PLUGIN DEFINITION
  $.fn.timepicker = function (option) {
    var args = Array.apply(null, arguments);
    args.shift();
    return this.each(function () {
      var $this = $(this),
        data = $this.data('timepicker'),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data('timepicker', (data = new Timepicker(this, $.extend({}, $.fn.timepicker.defaults, options, $(this).data()))));
      }

      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };

  $.fn.timepicker.defaults = {
    defaultTime: 'current',
    disableFocus: false,
    disableMousewheel: false,
    minuteStep: 15,
    secondStep: 15,
    showSeconds: false,
    showMeridian: true,
    showWidgetOnAddonClick: true
  };

  $.fn.timepicker.Constructor = Timepicker;

})(jQuery, window, document);

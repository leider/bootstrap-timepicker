/*! simple-timepicker v0.9.0 
* https://github.com/leider/simple-timepicker 
* Copyright (c) 2015 Andreas Leidig 
* MIT License 
*/!function($, window, document) {
    "use strict";
    function Timepicker(element, options) {
        this.widget = "", this.$element = $(element), this.defaultTime = options.defaultTime, 
        this.disableFocus = options.disableFocus, this.disableMousewheel = options.disableMousewheel, 
        this.isOpen = options.isOpen, this.minuteStep = options.minuteStep, this.orientation = options.orientation, 
        this.secondStep = options.secondStep, this.showMeridian = options.showMeridian, 
        this.showSeconds = options.showSeconds, this.template = options.template, this.showWidgetOnAddonClick = options.showWidgetOnAddonClick, 
        this.$element.on({
            "focus.timepicker": $.proxy(this.highlightUnit, this),
            "click.timepicker": $.proxy(this.highlightUnit, this),
            "keydown.timepicker": $.proxy(this.elementKeydown, this),
            "blur.timepicker": $.proxy(this.blurElement, this),
            "mousewheel.timepicker DOMMouseScroll.timepicker": $.proxy(this.mousewheel, this)
        }), this.setDefaultTime(this.defaultTime);
    }
    Timepicker.prototype = {
        constructor: Timepicker,
        blurElement: function() {
            this.highlightedUnit = null, this.updateFromElementVal();
        },
        clear: function() {
            this.hour = "", this.minute = "", this.second = "", this.meridian = "", this.$element.val("");
        },
        decrementHour: function() {
            var hour = this.hour;
            return this.showMeridian ? 1 === hour ? void (this.hour = 12) : 12 === hour || 0 === hour ? (this.hour = 11, 
            void this.toggleMeridian()) : void this.hour-- : 0 >= hour ? void (this.hour = 23) : void this.hour--;
        },
        decrementMinute: function(step) {
            var newVal = this.minute - (step || this.minuteStep);
            0 > newVal ? (this.decrementHour(), this.minute = newVal + 60) : this.minute = newVal;
        },
        decrementSecond: function() {
            var newVal = this.second - this.secondStep;
            0 > newVal ? (this.decrementMinute(1), this.second = newVal + 60) : this.second = newVal;
        },
        elementKeydown: function(e) {
            switch (e.keyCode) {
              case 9:
              case 27:
                this.updateFromElementVal();
                break;

              case 37:
                e.preventDefault(), this.highlightPrevUnit();
                break;

              case 38:
                switch (e.preventDefault(), this.highlightedUnit) {
                  case "hour":
                    this.incrementHour(), this.highlightHour();
                    break;

                  case "minute":
                    this.incrementMinute(), this.highlightMinute();
                    break;

                  case "second":
                    this.incrementSecond(), this.highlightSecond();
                    break;

                  case "meridian":
                    this.toggleMeridian(), this.highlightMeridian();
                }
                this.update();
                break;

              case 39:
                e.preventDefault(), this.highlightNextUnit();
                break;

              case 40:
                switch (e.preventDefault(), this.highlightedUnit) {
                  case "hour":
                    this.decrementHour(), this.highlightHour();
                    break;

                  case "minute":
                    this.decrementMinute(), this.highlightMinute();
                    break;

                  case "second":
                    this.decrementSecond(), this.highlightSecond();
                    break;

                  case "meridian":
                    this.toggleMeridian(), this.highlightMeridian();
                }
                this.update();
            }
        },
        getCursorPosition: function() {
            var input = this.$element.get(0);
            if ("selectionStart" in input) return input.selectionStart;
            if (document.selection) {
                input.focus();
                var sel = document.selection.createRange(), selLen = document.selection.createRange().text.length;
                return sel.moveStart("character", -input.value.length), sel.text.length - selLen;
            }
        },
        getTime: function() {
            return "" === this.hour ? "" : this.hour + ":" + (1 === this.minute.toString().length ? "0" + this.minute : this.minute) + (this.showSeconds ? ":" + (1 === this.second.toString().length ? "0" + this.second : this.second) : "") + (this.showMeridian ? " " + this.meridian : "");
        },
        highlightUnit: function() {
            this.position = this.getCursorPosition(), this.position >= 0 && this.position <= 2 ? this.highlightHour() : this.position >= 3 && this.position <= 5 ? this.highlightMinute() : this.position >= 6 && this.position <= 8 ? this.showSeconds ? this.highlightSecond() : this.highlightMeridian() : this.position >= 9 && this.position <= 11 && this.highlightMeridian();
        },
        highlightNextUnit: function() {
            switch (this.highlightedUnit) {
              case "hour":
                this.highlightMinute();
                break;

              case "minute":
                this.showSeconds ? this.highlightSecond() : this.showMeridian ? this.highlightMeridian() : this.highlightHour();
                break;

              case "second":
                this.showMeridian ? this.highlightMeridian() : this.highlightHour();
                break;

              case "meridian":
                this.highlightHour();
            }
        },
        highlightPrevUnit: function() {
            switch (this.highlightedUnit) {
              case "hour":
                this.showMeridian ? this.highlightMeridian() : this.showSeconds ? this.highlightSecond() : this.highlightMinute();
                break;

              case "minute":
                this.highlightHour();
                break;

              case "second":
                this.highlightMinute();
                break;

              case "meridian":
                this.showSeconds ? this.highlightSecond() : this.highlightMinute();
            }
        },
        highlightHour: function() {
            var $element = this.$element.get(0), self = this;
            this.highlightedUnit = "hour", $element.setSelectionRange && setTimeout(function() {
                self.hour < 10 ? $element.setSelectionRange(0, 1) : $element.setSelectionRange(0, 2);
            }, 0);
        },
        highlightMinute: function() {
            var $element = this.$element.get(0), self = this;
            this.highlightedUnit = "minute", $element.setSelectionRange && setTimeout(function() {
                self.hour < 10 ? $element.setSelectionRange(2, 4) : $element.setSelectionRange(3, 5);
            }, 0);
        },
        highlightSecond: function() {
            var $element = this.$element.get(0), self = this;
            this.highlightedUnit = "second", $element.setSelectionRange && setTimeout(function() {
                self.hour < 10 ? $element.setSelectionRange(5, 7) : $element.setSelectionRange(6, 8);
            }, 0);
        },
        highlightMeridian: function() {
            var $element = this.$element.get(0), self = this;
            this.highlightedUnit = "meridian", $element.setSelectionRange && (this.showSeconds ? setTimeout(function() {
                self.hour < 10 ? $element.setSelectionRange(8, 10) : $element.setSelectionRange(9, 11);
            }, 0) : setTimeout(function() {
                self.hour < 10 ? $element.setSelectionRange(5, 7) : $element.setSelectionRange(6, 8);
            }, 0));
        },
        incrementHour: function() {
            if (this.showMeridian) {
                if (11 === this.hour) return this.hour++, void this.toggleMeridian();
                12 === this.hour && (this.hour = 0);
            }
            return 23 === this.hour ? void (this.hour = 0) : void this.hour++;
        },
        incrementMinute: function(step) {
            var newVal = this.minute + (step || this.minuteStep - this.minute % this.minuteStep);
            newVal > 59 ? (this.incrementHour(), this.minute = newVal - 60) : this.minute = newVal;
        },
        incrementSecond: function() {
            var newVal = this.second + this.secondStep - this.second % this.secondStep;
            newVal > 59 ? (this.incrementMinute(1), this.second = newVal - 60) : this.second = newVal;
        },
        mousewheel: function(e) {
            if (this.disableMousewheel) return !1;
            e.preventDefault(), e.stopPropagation();
            var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail, scrollTo = null;
            switch ("mousewheel" === e.type ? scrollTo = -1 * e.originalEvent.wheelDelta : "DOMMouseScroll" === e.type && (scrollTo = 40 * e.originalEvent.detail), 
            scrollTo && (e.preventDefault(), $(this).scrollTop(scrollTo + $(this).scrollTop())), 
            this.highlightedUnit) {
              case "minute":
                delta > 0 ? this.incrementMinute() : this.decrementMinute(), this.highlightMinute();
                break;

              case "second":
                delta > 0 ? this.incrementSecond() : this.decrementSecond(), this.highlightSecond();
                break;

              case "meridian":
                this.toggleMeridian(), this.highlightMeridian();
                break;

              default:
                delta > 0 ? this.incrementHour() : this.decrementHour(), this.highlightHour();
            }
            return !1;
        },
        remove: function() {
            $("document").off(".timepicker"), delete this.$element.data().timepicker;
        },
        setDefaultTime: function(defaultTime) {
            if (this.$element.val()) this.updateFromElementVal(); else if ("current" === defaultTime) {
                var dTime = new Date(), hours = dTime.getHours(), minutes = dTime.getMinutes(), seconds = dTime.getSeconds(), meridian = "AM";
                0 !== seconds && (seconds = Math.ceil(dTime.getSeconds() / this.secondStep) * this.secondStep, 
                60 === seconds && (minutes += 1, seconds = 0)), 0 !== minutes && (minutes = Math.ceil(dTime.getMinutes() / this.minuteStep) * this.minuteStep, 
                60 === minutes && (hours += 1, minutes = 0)), this.showMeridian && (0 === hours ? hours = 12 : hours >= 12 ? (hours > 12 && (hours -= 12), 
                meridian = "PM") : meridian = "AM"), this.hour = hours, this.minute = minutes, this.second = seconds, 
                this.meridian = meridian, this.update();
            } else defaultTime ? this.setTime(defaultTime) : (this.hour = 0, this.minute = 0, 
            this.second = 0, this.meridian = "AM");
        },
        setTime: function(time, ignoreWidget) {
            if (!time) return void this.clear();
            var timeArray, hour, minute, second, meridian;
            "object" == typeof time && time.getMonth ? (hour = time.getHours(), minute = time.getMinutes(), 
            second = time.getSeconds(), this.showMeridian && (meridian = "AM", hour > 12 && (meridian = "PM", 
            hour %= 12), 12 === hour && (meridian = "PM"))) : (meridian = null !== time.match(/p/i) ? "PM" : "AM", 
            time = time.replace(/[^0-9\:]/g, ""), timeArray = time.split(":"), hour = timeArray[0] ? timeArray[0].toString() : timeArray.toString(), 
            minute = timeArray[1] ? timeArray[1].toString() : "", second = timeArray[2] ? timeArray[2].toString() : "", 
            hour.length > 4 && (second = hour.substr(4, 2)), hour.length > 2 && (minute = hour.substr(2, 2), 
            hour = hour.substr(0, 2)), minute.length > 2 && (second = minute.substr(2, 2), minute = minute.substr(0, 2)), 
            second.length > 2 && (second = second.substr(2, 2)), hour = parseInt(hour, 10), 
            minute = parseInt(minute, 10), second = parseInt(second, 10), isNaN(hour) && (hour = 0), 
            isNaN(minute) && (minute = 0), isNaN(second) && (second = 0), this.showMeridian ? 1 > hour ? hour = 1 : hour > 12 && (hour = 12) : (hour >= 24 ? hour = 23 : 0 > hour && (hour = 0), 
            13 > hour && "PM" === meridian && (hour += 12)), 0 > minute ? minute = 0 : minute >= 60 && (minute = 59), 
            this.showSeconds && (isNaN(second) ? second = 0 : 0 > second ? second = 0 : second >= 60 && (second = 59))), 
            this.hour = hour, this.minute = minute, this.second = second, this.meridian = meridian, 
            this.update(ignoreWidget);
        },
        toggleMeridian: function() {
            this.meridian = "AM" === this.meridian ? "PM" : "AM";
        },
        update: function() {
            this.updateElement(), this.$element.trigger({
                type: "changeTime.timepicker",
                time: {
                    value: this.getTime(),
                    hours: this.hour,
                    minutes: this.minute,
                    seconds: this.second,
                    meridian: this.meridian
                }
            });
        },
        updateElement: function() {
            this.$element.val(this.getTime()).change();
        },
        updateFromElementVal: function() {
            this.setTime(this.$element.val());
        }
    }, $.fn.timepicker = function(option) {
        var args = Array.apply(null, arguments);
        return args.shift(), this.each(function() {
            var $this = $(this), data = $this.data("timepicker"), options = "object" == typeof option && option;
            data || $this.data("timepicker", data = new Timepicker(this, $.extend({}, $.fn.timepicker.defaults, options, $(this).data()))), 
            "string" == typeof option && data[option].apply(data, args);
        });
    }, $.fn.timepicker.defaults = {
        defaultTime: "current",
        disableFocus: !1,
        disableMousewheel: !1,
        isOpen: !1,
        minuteStep: 15,
        orientation: {
            x: "auto",
            y: "auto"
        },
        secondStep: 15,
        showSeconds: !1,
        showMeridian: !0,
        template: !1,
        showWidgetOnAddonClick: !0
    }, $.fn.timepicker.Constructor = Timepicker;
}(jQuery, window, document);
describe('Keyboard events feature', function () {
  'use strict';

  var
    $input1,
    $timepicker1,
    tp1;

  beforeEach(function () {
    loadFixtures('timepicker.html');

    $input1 = $('#timepicker1');
    $timepicker1 = $input1.timepicker();
    tp1 = $timepicker1.data('timepicker');

  });

  afterEach(function () {
    $input1.data('timepicker').remove();
    $input1.remove();
  });

  it('should be able to set time via input', function () {

    $input1.trigger('focus');
    $input1.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}9:45a{{tab}}');

    expect(tp1.highlightedUnit).not.toBe('minute');
    expect(tp1.getTime()).toBe('9:45 AM');
    expect($input1.is(':focus')).toBe(false);
  });

  it('should be able to control element by the arrow keys', function () {
    tp1.setTime('11:30 AM');
    tp1.update();

    $input1.trigger('focus');

    if (tp1.highlightedUnit !== 'hour') {
      tp1.highlightHour();
    }

    expect(tp1.highlightedUnit).toBe('hour', 'hour should be highlighted by default');
    // hours
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 38 //up
    });
    expect(tp1.getTime()).toBe('12:30 PM', '1');
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:30 AM', '2');
    expect(tp1.highlightedUnit).toBe('hour', 'hour should be highlighted');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 39 //right
    });
    expect(tp1.highlightedUnit).toBe('minute', 'minute should be highlighted');

    //minutes
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 38 //up
    });
    expect(tp1.getTime()).toBe('11:45 AM', '3');
    expect(tp1.highlightedUnit).toBe('minute', 'minute should be highlighted 1');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:30 AM', '4');
    expect(tp1.highlightedUnit).toBe('minute', 'minute should be highlighted 2');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 39 //right
    });
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    //meridian
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 38 //up
    });
    expect(tp1.getTime()).toBe('11:30 PM', '5');
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:30 AM', '6');
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 37 //left
    });
    expect(tp1.highlightedUnit).toBe('minute', 'minutes should be highlighted');

    // minutes
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('11:15 AM', '7');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 37 //left
    });
    expect(tp1.highlightedUnit).toBe('hour', 'hours should be highlighted');

    // hours
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('10:15 AM', '8');

    $input1.trigger({
      'type': 'keydown',
      'keyCode': 37 //left
    });
    expect(tp1.highlightedUnit).toBe('meridian', 'meridian should be highlighted');

    // meridian
    $input1.trigger({
      'type': 'keydown',
      'keyCode': 40 //down
    });
    expect(tp1.getTime()).toBe('10:15 PM', '9');
  });

  it('should still be empty if input is empty', function () {
    $input1.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{tab}}');

    expect($input1.val()).toBe('');
  });

  it('should be 12:00 AM if 00:00 AM is entered', function () {
    $input1.autotype('{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}{{back}}0:0 AM{{tab}}');

    expect(tp1.getTime()).toBe('1:00 AM');
  });

});

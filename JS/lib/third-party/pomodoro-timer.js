var gHours = 0,
    gMinutes = 0,
    gSeconds = 0,
    remainingTime,
    countdownHandle/*,
    audio = new Audio('../beep.mp3')*/;

$(document).ready(function() {
    onPomodoroTimer();
});

function onPomodoroTimer(){
    stopTimer();
    gHours = 0;
    gMinutes = 50;
    gSeconds = 0;
    resetTimer();
    $('#shortButton').removeClass('btn-success');
    $('#longButton').removeClass('btn-success');
    $('#pomodoroButton').addClass('btn-success');
}

function onStartTimer(){
    stopTimer();
    startTimer();
}

function onStopTimer(){
    stopTimer();
}

function onResetTimer(){
    stopTimer();
    resetTimer();
}

function startAlarm(){
    if(remainingTime<1000) {
        //audio.play();
    }
}

function startTimer() {
    countdownHandle=setInterval(function() {
        decrementTimer();
    },1000);
}

function stopTimer() {
    clearInterval(countdownHandle);
    startAlarm();
}

function resetTimer() {
    remainingTime = (gHours*60*60*1000)+
    (gMinutes*60*1000)+
    (gSeconds*1000);
    renderTimer();
}

function renderTimer(){
    var deltaTime = remainingTime,
        hoursValue = Math.floor(deltaTime/(1000*60*60));

    deltaTime = deltaTime%(1000*60*60);

    var minutesValue = Math.floor(deltaTime/(1000*60));
    deltaTime = deltaTime%(1000*60);

    var secondsValue = Math.floor(deltaTime/(1000));

    animateTime(hoursValue, minutesValue, secondsValue);
}

function animateTime(remainingHours, remainingMinutes, remainingSeconds) {

    // position
    $('#hoursValue').css('top', '0em');
    $('#minutesValue').css('top', '0em');
    $('#secondsValue').css('top', '0em');

    $('#hoursNext').css('top', '0em');
    $('#minutesNext').css('top', '0em');
    $('#secondsNext').css('top', '0em');

    var oldHoursString = $('#hoursNext').text(),
        oldMinutesString = $('#minutesNext').text(),
        oldSecondsString = $('#secondsNext').text(),
        hoursString = formatTime(remainingHours),
        minutesString = formatTime(remainingMinutes),
        secondsString = formatTime(remainingSeconds);

    $('#hoursValue').text(oldHoursString);
    $('#minutesValue').text(oldMinutesString);
    $('#secondsValue').text(oldSecondsString);

    $('#hoursNext').text(hoursString);
    $('#minutesNext').text(minutesString);
    $('#secondsNext').text(secondsString);

    // set and animate
    if(oldHoursString !== hoursString) {
        $('#hoursValue').animate({top: '-=1em'});
        $('#hoursNext').animate({top: '-=1em'});
    }

    if(oldMinutesString !== minutesString) {
        $('#minutesValue').animate({top: '-=1em'});
        $('#minutesNext').animate({top: '-=1em'});
    }

    if(oldSecondsString !== secondsString) {
        $('#secondsValue').animate({top: '-=1em'});
        $('#secondsNext').animate({top: '-=1em'});
    }
}

function formatTime(intergerValue) {
    return intergerValue > 9 ? intergerValue.toString():'0'+intergerValue.toString();
}

function decrementTimer() {
    remainingTime-=(1*1000);

    if(remainingTime<1000) {
        onStopTimer();
    }
    renderTimer();
}
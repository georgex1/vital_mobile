$(document).ready(function(){
    startup();
});

function startup(){
    /*var windowsH = $(window).height();
    $('.ui-page').height(Math.round(windowsH*93/100));
    $('.ui-page').css('min-height', Math.round(windowsH*93/100));*/
}

$(document).on('pagebeforechange', function(e, data){ 
    $('.ui-panel-content-wrap').height($(window).height());
});
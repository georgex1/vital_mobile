$(document).ready(function(){
    startup();
});

function startup(){
    /*var windowsH = $(window).height();
    $('.ui-page').height(Math.round(windowsH*93/100));
    $('.ui-page').css('min-height', Math.round(windowsH*93/100));*/
}

$(document).on('pagebeforechange', function(e, data){
    $('#inactiveScreen2').show();
});

$(document).on('pagechange', function(e, data){
    $('#inactiveScreen2').hide();
});
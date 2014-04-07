$(document).ready(function(){
    startup();
});

function startup(){
    /*var windowsH = $(window).height();
    $('.ui-page').height(Math.round(windowsH*93/100));
    $('.ui-page').css('min-height', Math.round(windowsH*93/100));*/
    
    
    //$('#popup_content').html('dada');
    //$('#popup').show();
    
    $('#popupCloseBtn').on('tap', function(){
        $('#popup').fadeOut(700, function(){ $('#popup_content').html('');});
    });
    
    setTimeout(function(){
        var windowsH = $(window).height();
        $('#latidos .ui-content').height(windowsH);
        $('#mix_repro .ui-content').height(windowsH);
        $('#escuchar .ui-content').height(Math.round(windowsH*93/100));
    }, 200);
}

/*$(document).on('pagebeforechange', function(e, data){
    $('#inactiveScreen2').show();
});

$(document).on('pagechange', function(e, data){
    $('#inactiveScreen2').hide();
});*/
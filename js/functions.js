/* Listeners */
//document.addEventListener("deviceready", startup, false);
$(document).ready(function(){
    startup();
});

function startup(){
    $('#escuchar_control').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).find('img').attr('src', 'images/escuchar_play.png');
            $('#escuchar_beat').attr('src', 'images/beat.png');
        }else{
            $(this).addClass('active');
            $(this).find('img').attr('src', 'images/escuchar_pause.png');
            $('#escuchar_beat').attr('src', 'images/beat.gif');
        }
    });
    
    $('#escuchar_controls_share').on('click', function(){
        $('#share_options').slideToggle();
    });
    
    
    $('.margin_arrow').click(function(){
        $('.text_box').animate({'margin-top': '0'}, 500);
        $('.margin_arrow').hide();
        $('.vital40').css('overflow', 'auto');
    });
    
    $('#code_form').submit(function(){
        $.mobile.changePage( "#home", {transition: "none"});
        return false;
    });
}
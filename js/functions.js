var fileSystem;
var filePaht_ = '';
var isPhonegap = true;
var PathUrl = 'http://www.thepastoapps.com/proyectos/vital/';
var responseUrl = PathUrl+'response.php';
var imageUrl = '';
var LatidosData = null;
var media = null;
var latidosMp3 = '';
var selMusic = '';
var escuchar = 'bpm';

/* Listeners */
if(isPhonegap){
    document.addEventListener("deviceready", startup, false);
}else{
    $(document).ready(function(){
        startup();
    });
}

function startup(){
    
    if(isPhonegap){
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }
    page_events();
}

function page_events(){
    
    $('#escuchar_control').on('click', function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $(this).find('img').attr('src', 'images/escuchar_play.png');
            $('#escuchar_beat').attr('src', 'images/beat.png');
            //if(LatidosData.latidosmp3 != ''){
            if(escuchar == 'bpm'){
                media = new Media('latidos/'+LatidosData.beat_ratio+'bpm.mp3', null, function(e) { alert(JSON.stringify(e));});
                media.play();
                
            }else{
                //comprobar y descargar mp3 con latidos
                $.get(filePaht_ + "/vital/"+LatidosData.latidosmp3).done(function(){
                    latidosMp3 = filePaht_ + "/vital/"+latidosmp3;
                    
                    media = new Media(latidosMp3, null, function(e) { alert(JSON.stringify(e));});
                    media.play();
                });
                if(latidosMp3 == ''){
                    downloadFcn('latidos_musica/'+LatidosData.latidosmp3, 'mp3');
                }
            }
            
        }else{
            $(this).addClass('active');
            $(this).find('img').attr('src', 'images/escuchar_pause.png');
            $('#escuchar_beat').attr('src', 'images/beat.gif');
            
            media.stop();
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
    
    
    $('#code_form').submit(function() {
        $.ajax({
            url: responseUrl,
            type: "POST",
            dataType: 'json',
            callback: 'callback',
            data: 'mobile=1&action=getCode&code='+$('#Icode').val(),
            success: function(data){
                if(data.error == ''){
                    
                    setTimeout(function(){
                        $.get(filePaht_ + "/vital/"+data.content.foto_url).done(function(){
                            imageUrl = filePaht_ + "/vital/"+data.content.foto_url
                        });
                        if(imageUrl == ''){
                            downloadFcn(data.content.foto_url, 'image');
                        }
                    }, 100);
                    
                    LatidosData = data.content;
                    
                    $.mobile.changePage( "#home", {transition: "none"});
                }else{
                    openErrorPopup(data.error);
                }
            },beforeSend: function() {
                $.mobile.loading('show');
            }, //Show spinner
            complete: function() {
                $.mobile.loading('hide');
            },
            error: function (obj, textStatus, errorThrown) {
                $.mobile.loading('hide');
                openErrorPopup('Error al recibir los datos');
            }
        });
        return false;
    });
    
    $( "#latidos" ).on( "pageshow", function( event, ui ) {
        if(LatidosData.latidosmp3 != ''){
            $('#escuchar_latidoMusica img').attr('src', 'images/latido_musica_active.png');
            $('#escuchar_latidoMusica span').remove();
            
            $('#escuchar_latidoMusica').on('tap', function(){
                $.mobile.changePage( "#escuchar", {transition: "none"});
            });
        }else{
            $.mobile.changePage( "#mix", {transition: "none"});
        }
    });
    
    $( "#escuchar" ).on( "pageshow", function( event, ui ) {
        if(escuchar == 'bpm'){
            $( "#escuchar h1" ).html('Escuchar latidos');
        }else{
            $( "#escuchar h1" ).html('Escuchar música');
        }
    });
    
    $( "#mix_repro" ).on( "pageshow", function( event, ui ) {
        media = new Media(PathUrl+'musica/'+selMusic+'.mp3', null, function(e) { alert(JSON.stringify(e));});
        media.play();
    });
    
    $( "#musicList li a" ).on('tap', function(){
        selMusic = $(this).attr('rel');
    });
    
    $( ".reproductor_opts_cancel" ).on('tap', function(){
        $.mobile.changePage( "#mix", {transition: "none"});
    });
    
    $( ".reproductor_opts_ok" ).on('tap', function(){
        $.ajax({
            url: responseUrl,
            type: "POST",
            dataType: 'json',
            callback: 'callback',
            data: 'mobile=1&action=latidosmp3&latidos_bpm='+LatidosData.bpm_latidos+'&musica='+selMusic+'&Uid='+LatidosData.id,
            success: function(data){
                if(data.error == ''){
                    escuchar = 'musica';
                    latidosMp3 = data.content.latidosmp3;
                    LatidosData.latidosmp3 = data.content.latidosmp3;
                    $.mobile.changePage( "#escuchar", {transition: "none"});
                }else{
                    openErrorPopup(data.error);
                }
            },beforeSend: function() {
                $.mobile.loading('show');
            }, //Show spinner
            complete: function() {
                $.mobile.loading('hide');
            },
            error: function (obj, textStatus, errorThrown) {
                $.mobile.loading('hide');
                openErrorPopup('Error al recibir los datos');
            }
        });
    });
    
}

function openErrorPopup(mjs){
    /*$('#popup-message').html(mjs);
    setTimeout(function(){
        $('#popup').show();
        var PopT = ( $(window).height() -  ($('#popup .box').height()*1+90))/2;
        if(PopT > 0){
            $('#popup .box').css('margin-top', PopT);
        }
    }, 100);*/
    alert(mjs);
}


function downloadFcn(file_name_, type_) {
    
    var ft = new FileTransfer();
    var uri = encodeURI(PathUrl+file_name_);

    var downloadPath = filePaht_ + "/vital/"+file_name_;
    
    /*ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $('#status').html(perc + "% loaded...") ;
        } else {
            if($('#status').html() == "") {
                $('#status').html('loading..') ;
            } else {
                $('#status').append('.');
            }
        }
    };*/

    ft.download(uri, downloadPath, 
    function(entry) {
        if(type_ == 'image')
            imageUrl = entry.fullPath;
        else if(type_ == 'mp3'){
            latidosMp3 = entry.fullPath;
            
            media = new Media(latidosMp3, null, function(e) { alert(JSON.stringify(e));});
            media.play();
        }
    }, 
    function(error) {
        openErrorPopup('Ocurrio un error, por favor intentalo de nuevo.');    
    });
}

function gotFS(fileSystem) {
    filePaht_ = fileSystem.root.fullPath;
}
function fail(){
    console.log('fail to get filepath');
}

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
var escuchar_ = 'bpm';

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

function stopMainAudio(){
    $('#escuchar_control').removeClass('active');
    $('#escuchar_control').find('img').attr('src', 'images/escuchar_play.png');
    $('#escuchar_beat').attr('src', 'images/beat.png');
    if(media){
        media.stop();
        media = null;
    }
}

function page_events(){
    
    $('#escuchar_control').on('tap', function(){
        if($(this).hasClass('active')){
            stopMainAudio();
        }else{
            $(this).addClass('active');
            $(this).find('img').attr('src', 'images/escuchar_pause.png');
            $('#escuchar_beat').attr('src', 'images/beat.gif');
            
            if(escuchar_ == 'bpm'){
                console.log('escuchar bpm: '+'latidos/'+LatidosData.beat_ratio+'bpm.mp3');
                //media = new Media('/android_asset/www'+'/latidos/'+LatidosData.beat_ratio+'bpm.mp3', null, function(e) { console.log(e);});
                media = new Media(getPhoneGapPath()+'latidos/'+LatidosData.beat_ratio+'bpm.mp3', stopMainAudio, function(e) { console.log(e);});
                media.play();
                
            }else{
                //comprobar y descargar mp3 con latidos
                $.get(filePaht_ + "/vital/latidos_musica/"+LatidosData.latidosmp3).done(function(){
                    latidosMp3 = filePaht_ + "/vital/latidos_musica/"+latidosmp3;
                    
                    media = new Media(latidosMp3, stopMainAudio, function(e) { console.log(e);});
                    media.play();
                    console.log('escuchar con mp3: '+latidosMp3);
                });
                if(latidosMp3 == '' || latidosMp3 == null){
                    console.log('descargar latido con mp3: '+'latidos_musica/'+LatidosData.latidosmp3);
                    downloadFcn('latidos_musica/'+LatidosData.latidosmp3, 'mp3');
                }
            }
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
                    LatidosData = data.content;
                    $.get(filePaht_ + "/vital/"+data.content.foto_url).done(function(){
                        imageUrl = filePaht_ + "/vital/"+data.content.foto_url
                        $('#escuchar_top img').attr('src', imageUrl);
                    });
                    
                    setTimeout(function(){
                        if(imageUrl == ''){
                            downloadFcn(data.content.foto_url, 'image');
                        }
                        $.mobile.changePage( "#home", {transition: "none"});
                    }, 200);
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
    
    $( "#home" ).on( "pageshow", function( event, ui ) {
        //$.mobile.loading('show');
        //getPhoneGapPath();
    });
    
    $( "#latidos" ).on( "pageshow", function( event, ui ) {
        if(LatidosData.latidosmp3 != '' && LatidosData.latidosmp3 != null){
            $('#escuchar_latidoMusica img').attr('src', 'images/latido_musica_active.png');
            $('#escuchar_latidoMusica span').remove();
        }
    });
    
    $('#escuchar_latidos').on('tap', function(){
        console.log('#escuchar_latidos');
        escuchar_ = 'bpm';
        $.mobile.changePage( "#escuchar", {transition: "none"});
    });
    
    $('#escuchar_latidoMusica').on('tap', function(){
        console.log('#escuchar_latidoMusica');
        escuchar_ = 'musica';
        if(LatidosData){
            if(LatidosData.latidosmp3 != '' && LatidosData.latidosmp3 != null){
                $.mobile.changePage( "#escuchar", {transition: "none"});
            }else{
                $.mobile.changePage( "#mix", {transition: "none"});
            }
        }
    });
    
    $( "#escuchar" ).on( "pageshow", function( event, ui ) {
        if(escuchar_ == 'bpm'){
            $( "#escuchar_title" ).html('Escuchar latidos');
        }else{
            if(LatidosData.latidosmp3 == '' || LatidosData.latidosmp3 == null){
                $.mobile.changePage( "#mix", {transition: "none"});
            }
            $( "#escuchar_title" ).html('Escuchar música');
        }
    });
    $( "#escuchar" ).on( "pagehide", function( event, ui ) {
        if(media){
            media.stop();
            media = null;
        }
    });
    
    $( "#mix_repro" ).on( "pageshow", function( event, ui ) {
        console.log("esuchar mix_repro: "+PathUrl+'musica/'+selMusic+'.mp3');
        media = new Media(PathUrl+'musica/'+selMusic+'.mp3', stopMixRepro, function(e) { console.log(e);});
        media.play();
    });
    
    $( "#mix_repro" ).on( "pagehide", function( event, ui ) {
        if(media){
            media.stop();
            media = null;
        }
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
            data: 'mobile=1&action=latidosmp3&latidos_bpm='+LatidosData.beat_ratio+'&musica='+selMusic+'&Uid='+LatidosData.id,
            success: function(data){
                if(data.error == ''){
                    escuchar_ = 'musica';
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

function stopMixRepro(){
    if(media){
        media.stop();
        media = null;
    }
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
    $.mobile.loading('show');
    var type2_ = type_;
    var ft = new FileTransfer();
    var uri = encodeURI(PathUrl+file_name_);

    var downloadPath = filePaht_ + "/vital/"+file_name_;
    console.log('downloadPath: ' + downloadPath);
    console.log('downloadUrl: ' + PathUrl+file_name_);
    
    ft.download(uri, downloadPath, 
    function(entry) {
        if(type2_ == 'image'){
            imageUrl = entry.fullPath;
            $('#escuchar_top img').attr('src', imageUrl);
            $.mobile.loading('hide');
        }else if(type2_ == 'mp3'){
            latidosMp3 = entry.fullPath;
            
            media = new Media(latidosMp3, stopMainAudio, function(e) { console.log(e);});
            media.play();
            $.mobile.loading('hide');
        }
    }, 
    function(error) {
        openErrorPopup('Ocurrio un error, por favor intentalo de nuevo.');    
    });
    
    ft.onprogress = function(progressEvent) {
        $('#popup_content').html('<p id="status"></p>');
        $('#popup').show();
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $('#status').html(perc + "% descargando...") ;
        } else {
            if($('#status').html() == "") {
                $('#status').html('descargando..') ;
            } else {
                $('#status').append('.');
            }
        }
    };
    $('#popup').hide();
    $('#popup_content').html('');
}

function gotFS(fileSystem) {
    filePaht_ = fileSystem.root.fullPath;
}
function fail(){
    console.log('fail to get filepath');
}

function getPhoneGapPath(){
    /*'use strict';*/
    var path = window.location.pathname;
    var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
    return phoneGapPath;
    
}

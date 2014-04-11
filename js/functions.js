var fileSystem;
var filePaht_ = '';
var isPhonegap = true;
var PathUrl = 'http://www.latidosvitales.com/';
var responseUrl = PathUrl+'response.php';
var imageUrl = '';
var LatidosData = null;
var media = null;
var latidosMp3 = '';
var latidosMusicaMp3 = '';
var musicaMp3 = '';
var selMusic = '';
var selMusicName = '';
var escuchar_ = 'bpm';
var videoUrl = 'https://www.youtube.com/watch?v=S-Q8wX7N7xI';
var db = '';

/* Listeners */
if(isPhonegap){
    document.addEventListener("deviceready", startup, false);
}else{
    $(document).ready(function(){
        startup();
    });
}

/*$(document).on('pagebeforechange', function(e, data){
    $('#inactiveScreen2').show();
    setTimeout(function(){
        $('#inactiveScreen2').hide();
    }, 200);
});*/

$(document).on('pagechange', function(e, data){
    /*$('#inactiveScreen2').show();
    setTimeout(function(){
        $('#inactiveScreen2').hide();
    }, 500);*/
});

function startup(){
    console.log('startup');
    if(isPhonegap){
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        
        db = window.openDatabase('vitalmobile', "1.0", 'vitalmobile', 20000);
        db.transaction(createDB, errorCB, successCB);
        setTimeout(function(){
            console.log('db.transaction loginDb');
            db.transaction(loginDb, errorCB);
        }, 100);
        
    }
    
    /*var windowsH = $(window).height();
    $('.ui-page').height(Math.round(windowsH*93/100));
    $('.ui-page').css('min-height',Math.round(windowsH*93/100));*/
    
    /*setTimeout(function(){
        var windowsH = $(window).height();
        $('#latidos .ui-content').height(Math.round(windowsH*93/100));
        $('#mix_repro .ui-content').height(Math.round(windowsH*93/100));
        $('#escuchar .ui-content').height(Math.round(windowsH*93/100));
    }, 200);*/
    
    page_events();
}

function initVars(){
    imageUrl = '';
    LatidosData = null;
    media = null;
    latidosMp3 = '';
    latidosMusicaMp3 = '';
    musicaMp3 = '';
    selMusic = '';
    selMusicName = '';
    escuchar_ = 'bpm';
    //videoUrl = '';
}

//database to login
function registerDb(){
   db.transaction(registerDbI, errorCB);
}

function registerDbI(tx){
    tx.executeSql('DROP TABLE IF EXISTS VITALMOBILE');
    tx.executeSql('CREATE TABLE IF NOT EXISTS VITALMOBILE (id unique, email_madre, nombre_madre, email_hijo, nombre_hijo, foto_url, bpm_latidos, latidosmp3, beat_ratio, codigo, video, recomendada)');
    tx.executeSql('INSERT INTO VITALMOBILE (id, email_madre, nombre_madre, email_hijo, nombre_hijo, foto_url, bpm_latidos, latidosmp3, beat_ratio, codigo, video, recomendada) VALUES ('+LatidosData.id+', "'+LatidosData.email_madre+'", "'+LatidosData.nombre_madre+'", "'+LatidosData.email_hijo+'", "'+LatidosData.nombre_hijo+'", "'+LatidosData.foto_url+'", "'+LatidosData.bpm_latidos+'", "'+LatidosData.latidosmp3+'", "'+LatidosData.beat_ratio+'", "'+LatidosData.codigo+'", "'+LatidosData.video+'", "'+LatidosData.recomendada+'")');
}

function createDB(tx) {
    console.log('createDB');
    tx.executeSql('CREATE TABLE IF NOT EXISTS VITALMOBILE (id unique, email_madre, nombre_madre, email_hijo, nombre_hijo, foto_url, bpm_latidos, latidosmp3, beat_ratio, codigo, video, recomendada)');
}

function loginDb(tx) {
    console.log('loginDb');
    tx.executeSql('SELECT * FROM VITALMOBILE', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    //console.log("Returned rows = " + results.rows.length);
    if(results.rows.length > 0){
        LatidosData = {'id':'','email_madre':'','nombre_madre':'','email_hijo':'','nombre_hijo':'','foto_url':'','bpm_latidos':'','latidosmp3':'','beat_ratio':'','codigo':'','video':'', 'recomendada':''};
        
        LatidosData.id = results.rows.item(0).id;
        LatidosData.email_madre = results.rows.item(0).email_madre;
        LatidosData.nombre_madre = results.rows.item(0).nombre_madre;
        LatidosData.email_hijo = results.rows.item(0).email_hijo;
        LatidosData.nombre_hijo = results.rows.item(0).nombre_hijo;
        LatidosData.foto_url = results.rows.item(0).foto_url;
        LatidosData.bpm_latidos = results.rows.item(0).bpm_latidos;
        LatidosData.latidosmp3 = results.rows.item(0).latidosmp3;
        LatidosData.beat_ratio = results.rows.item(0).beat_ratio;
        LatidosData.codigo = results.rows.item(0).codigo;
        LatidosData.video = results.rows.item(0).video;
        LatidosData.recomendada = results.rows.item(0).recomendada;
        
        posLogin();
    }
}

function errorCB(err) {
    console.log(err);
}
function successCB() {
    //console.log('DB success');
}

function updateDB(sql_){
    db.transaction(function(tx){
        tx.executeSql(sql_);
    }, errorCB);
}

function logout(){
    updateDB('DROP TABLE IF EXISTS VITALMOBILE');
    initVars();
    try{
        navigator.app.exitApp();
    }catch(e){
        $.mobile.changePage( "#code", {transition: "none"});
    }
}


function stopMainAudio(){
    $('#escuchar_control').removeClass('active');
    $('#escuchar_control').find('img').attr('src', 'images/escuchar_play.png');
    $('#escuchar_beat').attr('src', 'images/beat.png');
    if(media){
        setTimeout(function(){
            media.stop();
            media = null;
        }, 500);
    }
}

function posLogin(){
    //videoUrl = LatidosData.video;
    $.get(filePaht_ + "/vital/"+LatidosData.foto_url).done(function(){
        imageUrl = filePaht_ + "/vital/"+LatidosData.foto_url
        $('#escuchar_top img').attr('src', imageUrl);
    });
    
    setTimeout(function(){
        if(imageUrl == ''){
            downloadFcn(LatidosData.foto_url, 'image');
        }
        console.log('posLogin redir home');
        $.mobile.changePage( "#home", {transition: "none"});
    }, 200);
}

function page_events(){
    
    $('#escuchar_control').on('tap', function(){
        if($(this).hasClass('active')){
            stopMainAudio();
        }else{
            
            if(escuchar_ == 'bpm'){
                //comprobar y descargar latidos
                $.get(filePaht_ + "/vital/latidos/"+LatidosData.beat_ratio+'bpm.mp3').done(function(){
                    latidosMp3 = filePaht_ + "/vital/latidos/"+LatidosData.beat_ratio+'bpm.mp3';
                    
                    if(media == null){
                        media = new Media(latidosMp3, stopMainAudio, function(e) { console.log(e);});
                        media.play();
                        $('#escuchar_control').addClass('active');
                        $('#escuchar_control img').attr('src', 'images/escuchar_pause.png');
                        $('#escuchar_beat').attr('src', 'images/beat.gif');
                    }
                    
                    console.log('escuchar solo latido: '+latidosMp3);
                });
                setTimeout(function(){
                    if(latidosMp3 == '' || latidosMp3 == null){
                        console.log('descargar latido: '+'vital/latidos/'+LatidosData.beat_ratio+'bpm.mp3');
                        downloadFcn('latidos/'+LatidosData.beat_ratio+'bpm.mp3', 'latidos');
                    }
                    console.log('escuchar bpm: '+'latidos/'+LatidosData.beat_ratio+'bpm.mp3');
                    //media = new Media('/android_asset/www'+'/latidos/'+LatidosData.beat_ratio+'bpm.mp3', null, function(e) { console.log(e);});
                    //media = new Media(getPhoneGapPath()+'latidos/'+LatidosData.beat_ratio+'bpm.mp3', stopMainAudio, function(e) { console.log(e);});
                    //media.play();
                }, 200);
                
            }else{
                //comprobar y descargar mp3 con latidos
                $.get(filePaht_ + "/vital/latidos_musica/"+LatidosData.latidosmp3).done(function(){
                    latidosMusicaMp3 = filePaht_ + "/vital/latidos_musica/"+LatidosData.latidosmp3;
                    
                    if(media == null){
                        media = new Media(latidosMusicaMp3, stopMainAudio, function(e) { console.log(e);});
                        media.play();
                        $('#escuchar_control').addClass('active');
                        $('#escuchar_control img').attr('src', 'images/escuchar_pause.png');
                        $('#escuchar_beat').attr('src', 'images/beat.gif');
                    }
            
                    console.log('escuchar con mp3: '+latidosMusicaMp3);
                });
                setTimeout(function(){
                    if(latidosMusicaMp3 == '' || latidosMusicaMp3 == null){
                        console.log('descargar latido con mp3: '+'latidos_musica/'+LatidosData.latidosmp3);
                        downloadFcn('latidos_musica/'+LatidosData.latidosmp3, 'mp3');
                    }
                }, 200);
            }
        }
    });
    
    $('#escuchar_controls_share').on('click', function(){
        $('#share_options').slideToggle();
    });
    
    
    $('.margin_arrow').click(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('.text_box.margin').animate({'margin-top': '65%'}, 500);
            $('.margin_arrow img').attr('src', 'images/vital40_arrow.png');
            $('.vital40').css('overflow', 'hidden');
        }else{
            $(this).addClass('active');
            $('.text_box.margin').animate({'margin-top': '0'}, 500);
            $('.margin_arrow img').attr('src', 'images/vital40_arrow_back.png');
            $('.vital40').css('overflow', 'auto');
        }
    });
    
    
    $('#code_form').submit(function() {
        if(navigator.connection.type!=Connection.NONE){
        $.ajax({
            url: responseUrl,
            type: "POST",
            dataType: 'json',
            callback: 'callback',
            data: 'mobile=1&action=getCode&code='+$('#Icode').val(),
            success: function(data){
                if(data.error == ''){
                    LatidosData = data.content;
                    
                    setTimeout(function(){
                        registerDb();
                        
                        setTimeout(function(){
                            posLogin();
                        }, 200);
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
        }else{
            openErrorPopup('<p>Necesitas estar conectado a internet para completar esta acción.</p>');
        }
        return false;
    });
    
    $( "#home" ).on( "pageshow", function( event, ui ) {
        //$.mobile.loading('show');
        //getPhoneGapPath();
    });
    
    $('#documental').on('pagebeforechange', function(e, data){
        if(LatidosData == null){
            $('#docNavPanel').hide();
            $('#docBackLink').on('tap', function(){
                $.mobile.changePage( "#code", {transition: "none"});
            });
        }else{
            $('#docNavPanel').show();
            $('#docBackLink').on('tap', function(){
                $.mobile.changePage( "#home", {transition: "none"});
            });
        }
    });
    
    $( "#documental" ).on( "pageshow", function( event, ui ) {
        
        setTimeout(function(){
            $( "#documental .documental" ).fadeIn();
        }, 300);
        
        $('#videoShareEmail').attr('href', 'mailto:?subject=Latidos%20Vitales&body=%20%20%20Mir%C3%A1%20el%20documental%20de%20Vital3%20ac%C3%A1%20%20%20%20%0D%0A%20%20%20'+videoUrl+'%20%20%20%0D%0A%20%20%20y%20enterate%20c%C3%B3mo%20regalarle%20tus%20latidos%20a%20tu%20hijo.%20%20%20');
    });
    
    $( "#latidos" ).on( "pageshow", function( event, ui ) {
        
        /*setTimeout(function(){
            var windowsH = $(window).height();
            $('#latidos .ui-content').height(Math.round(windowsH*93/100));
        }, 100);*/
        
        if(LatidosData.latidosmp3 != '' && LatidosData.latidosmp3 != null){
            $('#escuchar_latidoMusica img').attr('src', 'images/latido_musica_active.png');
        }
    });
    
    $('#escuchar_latidos').on('tap', function(){
        setTimeout(function(){
            console.log('#escuchar_latidos');
            escuchar_ = 'bpm';
            $.mobile.changePage( "#escuchar", {transition: "none"});
        }, 400);
    });
    
    $('#escuchar_latidoMusica').on('tap', function(){
        console.log('#escuchar_latidoMusica');
        escuchar_ = 'musica';
        setTimeout(function(){
            if(LatidosData){
                if(LatidosData.latidosmp3 != '' && LatidosData.latidosmp3 != null){
                    $.mobile.changePage( "#escuchar", {transition: "none"});
                }else{
                    $.mobile.changePage( "#mix", {transition: "none"});
                }
            }
        }, 400);
    });
    
    $( "#escuchar" ).on( "pageshow", function( event, ui ) {
        
        /*setTimeout(function(){
            var windowsH = $(window).height();
            $('#escuchar .ui-content').height(Math.round(windowsH*93/100));
        }, 100);*/
        
        alignImage();
        if(escuchar_ == 'bpm'){
            $( "#escuchar_title" ).html('Escuchar latidos');
        }else{
            if(LatidosData.latidosmp3 == '' || LatidosData.latidosmp3 == null){
                $.mobile.changePage( "#mix", {transition: "none"});
            }
            $( "#escuchar_title" ).html('Escuchá el latido mezclado con canciones de cuna');
            //$( "#escuchar_title" ).html('Escuchar música');
        }
    });
    $( "#escuchar" ).on( "pagehide", function( event, ui ) {
        if(media){
            setTimeout(function(){
                media.stop();
                media = null;
            }, 500);
        }
    });
    
    $( "#mix" ).on( "pageshow", function( event, ui ) {
        console.log(LatidosData);
        if(LatidosData.latidosmp3 != '' && LatidosData.latidosmp3 != null){
            console.log('redir escuchar');
            escuchar_ = 'musica';
            $.mobile.changePage( "#escuchar", {transition: "none"});
        }else{
            $('#popupCloseBtn').show();
            $('#popup_content').html('Por la velocidad de los latidos te recomendamos los mezcles con el track: '+LatidosData.recomendada);
            $('#popup').show();
        }
    });
    
    $( "#mix_repro" ).on( "pageshow", function( event, ui ) {
        
        /*setTimeout(function(){
            var windowsH = $(window).height();
            $('#mix_repro .ui-content').height(Math.round(windowsH*93/100));
        }, 100);*/
        
        if(LatidosData.latidosmp3 != '' && LatidosData.latidosmp3 != null){
            escuchar_ = 'musica';
            $.mobile.changePage( "#escuchar", {transition: "none"});
        }else{
            $('#mix_reproTitle').html(selMusicName);
            musicaMp3 = '';
            setTimeout(function(){
                //comprobar y descargar musica
                $.get(filePaht_ + "/vital/musica/"+selMusic+'.mp3').done(function(){
                    musicaMp3 = filePaht_ + "/vital/musica/"+selMusic+'.mp3';
                    
                    if(media == null){
                        media = new Media(musicaMp3, stopMixRepro, function(e) { console.log(e);});
                        media.play();
                    }
                    console.log('escuchar solo musica: '+musicaMp3);
                });
                setTimeout(function(){
                    if(musicaMp3 == '' || musicaMp3 == null){
                        console.log('descargar musica: '+'vital/musica/'+selMusic+'.mp3');
                        downloadFcn('musica/'+selMusic+'.mp3', 'musica');
                    }
                    console.log('escuchar musica: '+'musica/'+selMusic+'.mp3');
                }, 200);
            }, 200);
            
            
            /*
            $('#inactiveScreen').show();
            $.mobile.loading('show');
            setTimeout(function(){
                $.mobile.loading('hide');
                $('#inactiveScreen').hide();
            }, 4000);
            
            console.log("esuchar mix_repro: "+PathUrl+'musica/'+selMusic+'.mp3');
            if(media == null){
                media = new Media(PathUrl+'musica/'+selMusic+'.mp3', stopMixRepro, function(e) { console.log(e);});
                media.play();
            }*/
        }
    });
    
    $( "#mix_repro" ).on( "pagehide", function( event, ui ) {
        if(media){
            setTimeout(function(){
                media.stop();
                media = null;
            }, 500);
        }
        setTimeout(function(){
            if(media){
                media.stop();
                media = null;
            }
        }, 2000);
    });
    
    $( "#musicList li a" ).on('tap', function(){
        selMusic = $(this).attr('rel');
        selMusicName = $(this).html();
    });
    
    $( ".reproductor_opts_cancel" ).on('tap', function(){
        $.mobile.changePage( "#mix", {transition: "none"});
    });
    
    $( ".reproductor_opts_ok" ).on('tap', function(){
        if(navigator.connection.type!=Connection.NONE){
        $.ajax({
            url: responseUrl,
            type: "POST",
            dataType: 'json',
            callback: 'callback',
            data: 'mobile=1&action=latidosmp3&latidos_bpm='+LatidosData.beat_ratio+'&musica='+selMusic+'&Uid='+LatidosData.id,
            success: function(data){
                if(data.error == ''){
                    escuchar_ = 'musica';
                    //latidosMp3 = data.content.latidosmp3;
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
        }else{
            openErrorPopup('<p>Necesitas estar conectado a internet para completar esta acción.</p>');
        }
    });
    
    $('#Icode').on('tap', function(){
        $(this).val('');
    });
    
    $('#documental_play').on('tap', function(){
        window.open(videoUrl, '_blank', 'location=yes');
    });
    
    $('#popupCloseBtn').on('tap', function(){
        $('#popup').fadeOut(700, function(){ $('#popup_content').html(''); $('#popupCloseBtn').hide();});
    });
    
}

function alignImage(){
    var imgH = $('#escuchar_top img').height();
    var imgW = $('#escuchar_top img').width();
    
    var cntH = $('#escuchar_top').height();
    var cntW = $('#escuchar_top').width();
    
    if( (imgH * cntW / imgW) < cntH){
        $('#escuchar_top img').height(cntH*1+10);
    }else{
        $('#escuchar_top img').width(cntW*1+10);
    }
}

function stopMixRepro(){
    if(media){
        setTimeout(function(){
            media.stop();
            media = null;
        }, 500);
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
    
    if(navigator.connection.type!=Connection.NONE){
    
    $('#popup_content').html('<p id="status"></p>');
    $('#popup').show();
    $('#inactiveScreen').show();
    
    setTimeout(function(){
        
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
                latidosMusicaMp3 = entry.fullPath;
                if(media == null){
                    media = new Media(latidosMusicaMp3, stopMainAudio, function(e) { console.log(e);});
                    media.play();
                    
                    $('#escuchar_control').addClass('active');
                    $('#escuchar_control img').attr('src', 'images/escuchar_pause.png');
                    $('#escuchar_beat').attr('src', 'images/beat.gif');
                }
                $.mobile.loading('hide');
            }else if(type2_ == 'latidos'){
                latidosMp3 = entry.fullPath;
                if(media == null){
                    media = new Media(latidosMp3, stopMainAudio, function(e) { console.log(e);});
                    media.play();
                    
                    $('#escuchar_control').addClass('active');
                    $('#escuchar_control img').attr('src', 'images/escuchar_pause.png');
                    $('#escuchar_beat').attr('src', 'images/beat.gif');
                }
                $.mobile.loading('hide');
            }else if(type2_ == 'musica'){
                musicaMp3 = entry.fullPath;
                if(media == null){
                    media = new Media(musicaMp3, stopMixRepro, function(e) { console.log(e);});
                    media.play();
                }
                $.mobile.loading('hide');
            }
            $('#inactiveScreen').hide();
            $('#popup').hide();
            $('#popup_content').html('');
        }, 
        function(error) {
            openErrorPopup('Ocurrio un error, por favor intentalo de nuevo.');    
            $('#inactiveScreen').hide();
            $('#popup').hide();
            $('#popup_content').html('');
        });
        
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                if(type2_ == 'image'){
                    $('#status').html('Obteniendo Imágen...');
                }else{
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    $('#status').html(Math.floor(perc/2) + "% descargando...") ;
                }
            } else {
                if($('#status').html() == "") {
                    $('#status').html('descargando..') ;
                } else {
                    $('#status').append('.');
                }
            }
        };
        
    }, 200);
    }
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

function open_fb_share(Svideo){
    if(navigator.connection.type!=Connection.NONE){
        if(Svideo == 1)
            window.open('http://m.facebook.com/sharer.php?u='+encodeURI(videoUrl), '_blank', 'location=yes');
        else
            window.open('http://m.facebook.com/sharer.php?u='+encodeURI(PathUrl), '_blank', 'location=yes');
    }else{
        openErrorPopup('<p>Necesitas estar conectado a internet para completar esta acción.</p>');
    }
}

function open_google_share(Svideo){
    if(navigator.connection.type!=Connection.NONE){
        if(Svideo == 1)
            window.open('https://plus.google.com/share?url='+encodeURI(videoUrl), '_blank', 'location=yes');
        else
            window.open('https://plus.google.com/share?url='+encodeURI(PathUrl), '_blank', 'location=yes');
    }else{
        openErrorPopup('<p>Necesitas estar conectado a internet para completar esta acción.</p>');
    }
}

function open_twitter_share(Svideo){
    if(navigator.connection.type!=Connection.NONE){
        if(Svideo == 1)
            window.open('https://twitter.com/share?url='+encodeURI(videoUrl), '_blank', 'location=yes');
        else
            window.open('https://twitter.com/share?url='+encodeURI(PathUrl), '_blank', 'location=yes');
    }else{
        openErrorPopup('<p>Necesitas estar conectado a internet para completar esta acción.</p>');
    }
}


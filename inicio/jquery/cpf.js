function verifica_cpf_cnpj(valor) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if (valor.length === 11) {
        return 'CPF';
    } else if (valor.length === 14) {
        return 'CNPJ';
    } else {
        return false;
    }
}

function calc_digitos_posicoes(digitos, posicoes = 10, soma_digitos = 0) {
    digitos = digitos.toString();
    for (var i = 0; i < digitos.length; i++) {
        soma_digitos = soma_digitos + (digitos[i] * posicoes);
        posicoes--;
        if (posicoes < 2) {
            posicoes = 9;
        }
    }
    soma_digitos = soma_digitos % 11;
    if (soma_digitos < 2) {
        soma_digitos = 0;
    } else {
        soma_digitos = 11 - soma_digitos;
    }
    var cpf = digitos + soma_digitos;
    return cpf;
}

function valida_cpf(valor) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    var digitos = valor.substr(0, 9);
    var novo_cpf = calc_digitos_posicoes(digitos);
    var novo_cpf = calc_digitos_posicoes(novo_cpf, 11);
    if (novo_cpf === valor) {
        return true;
    } else {
        return false;
    }

}

function valida_cnpj(valor) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    var cnpj_original = valor;
    var primeiros_numeros_cnpj = valor.substr(0, 12);
    var primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);
    var segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);
    var cnpj = segundo_calculo;
    if (cnpj === cnpj_original) {
        return true;
    }
    return false;
}

function valida_cpf_cnpj(valor) {
    var valida = verifica_cpf_cnpj(valor);
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if (valida === 'CPF') {
        return valida_cpf(valor);
    } else if (valida === 'CNPJ') {
        return valida_cnpj(valor);
    } else {
        return false;
    }
}

function formata_cpf_cnpj(valor) {
    var formatado = false;
    var valida = verifica_cpf_cnpj(valor);
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if (valida === 'CPF') {
        if (valida_cpf(valor)) {
            formatado = valor.substr(0, 3) + '.';
            formatado += valor.substr(3, 3) + '.';
            formatado += valor.substr(6, 3) + '-';
            formatado += valor.substr(9, 2) + '';

        }

    } else if (valida === 'CNPJ') {
        if (valida_cnpj(valor)) {
            formatado = valor.substr(0, 2) + '.';
            formatado += valor.substr(2, 3) + '.';
            formatado += valor.substr(5, 3) + '/';
            formatado += valor.substr(8, 4) + '-';
            formatado += valor.substr(12, 14) + '';
        }
    }
    return formatado;
}

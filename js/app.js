$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};
var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }



        $.each(filtro, (i, e) => {

            console.log(e.name)

            let template = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id);

            //Botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i <= 12) {
                $("#itensCardapio").append(template);
            }

            //paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(template)
            }
        })

        //remover o item ativa
        $(".container-menu a").removeClass('active');

        //seta o menu para ativa
        $("#menu-" + categoria).addClass('active')
    },

    //clique no botão de ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    // diminui a quantidade do item no cardapio
    diminuirQuantidade: (id) => {
        let qtdAtual = parseInt($("#qtd-" + id).text());

        if (qtdAtual > 0) {
            $("#qtd-" + id).text(qtdAtual - 1)
        }
    },
    // aumenta a quantidade do item no cardapio
    aumentarQuantidade: (id) => {
        let qtdAtual = parseInt($("#qtd-" + id).text());
        $("#qtd-" + id).text(qtdAtual + 1)
    },

    // adicionar ao cainho o item do cardapio
    adicionarAoCarrinho: (id) => {
        let qtdAtual = parseInt($("#qtd-" + id).text());
        if (qtdAtual > 0) {
            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            let filtro = MENU[categoria];

            //obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elemento, index) => { return elemento.id == id });

                //caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qtd = MEU_CARRINHO[objIndex].qtd + qtdAtual;
                }
                //caso ainda não exista o item no carrinho, adiciona ele
                else {

                    item[0].qtd = qtdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qtd-" + id).text(0);

                cardapio.metodos.atualizarbadgeTotal();

            }
        }
    },

    //atualiza o badge de totais dos botões "Meu Carrinho"
    atualizarbadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qtd
        })

        if (total > 0) {

            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');

        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }


        $(".badge-total-carrinho").html(total);

    },

    //abrir a modal do carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }
        
    },

    //Mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("msg-" + id).remove();
            }, 800);
        }, tempo)
    }

}

cardapio.templates = {

    item: `
                        <div class="col-3 mb-5">
                            <div class="card card-item" id="\${id}">
                                <div class="img-produto">
                                    <img src="\${img}" alt=""/ >
                                </div>
                                <p class="title-produto text-center mt-4">
                                    <b>\${nome}</b>
                                </p>
                                <p class="price-produto text-center">
                                    <b>R$ \${preco}</b>
                                </p>
                                <div class="add-carrinho">
                                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fa fa-minus"></i></span>
                                    <span class="add-numero-itens" id="qtd-\${id}">0</span>
                                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fa fa-plus"></i></span>
                                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                                </div>


                            </div>
                        </div>

    `

}
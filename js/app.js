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
        }
    },
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
import { produtos, pedido, pedido_item } from './modulo.js';

var pedidoAtual = [];

document.addEventListener('DOMContentLoaded', criarCardsDeProdutos);

document.addEventListener('DOMContentLoaded', function() {
    const sidebarIcons = document.querySelectorAll('.sidebar .item_menu');
    const scrollContainer = document.querySelector('.nav_02');

    sidebarIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                let topPos = targetElement.offsetTop - scrollContainer.offsetTop;

                scrollContainer.scrollTo({
                    top: topPos - 120,
                    behavior: 'smooth'
                });
            }
        });
    });

    var btnLimpar = document.getElementById("btn_limpar");
    btnLimpar.onclick = function() {limparPedido()};

    var btnLimpar = document.getElementById("btn_continuar");
    btnLimpar.onclick = function() {fecharPedido()};
});

// Função para criar os cards de produtos
function criarCardsDeProdutos() {
    produtos.forEach(produto => {
        const container = document.querySelector(`.${produto.tipo} .nav_produtos`);

        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto_card';
        produtoCard.onclick = function() {itemIdAdicionar(produto.id); };

        const produtoImg = document.createElement('div');
        produtoImg.className = 'produto_img';
        produtoImg.style.backgroundImage = `url(img/background/${produto.id}.jpg)`;

        const produtoInfo = document.createElement('div');
        produtoInfo.className = 'produto_info';

        const produtoNome = document.createElement('p');
        produtoNome.className = 'produto_nome';
        produtoNome.textContent = produto.nome;

        const produtoValor = document.createElement('p');
        produtoValor.className = 'produto_valor';
        produtoValor.textContent = `R$ ${produto.valor}`;

        produtoInfo.appendChild(produtoNome);
        produtoInfo.appendChild(produtoValor);

        produtoCard.appendChild(produtoImg);
        produtoCard.appendChild(produtoInfo);

        container.appendChild(produtoCard);
    });
}

//Função que identifica o item selecionado para adicionar ao pedido
function itemIdAdicionar(id) {
    const produto = produtos.find(produto => produto.id === id);
    adicionarItemPedido(produto);
}

// Função para adicionar produtos ao pedido
function adicionarItemPedido(produto) {
    const pedidoItens = document.querySelector('.pedido_itens');
    const inputExistente = document.getElementById(`quant-${produto.id}`);

    // Verifica se o produto já existe no pedido
    if (inputExistente) {
        // Produto já existe, incrementa a quantidade
        processarQuantidade(1, produto.id);
    } else {
        const pedidoProduto = document.createElement('div');
        pedidoProduto.className = 'pedido_produto';
        pedidoProduto.id = `item_quant-${produto.id}`;
        pedidoProduto.innerHTML = `
            <p class="pedido_nome_produto">${produto.nome}</p>
            <div data-app="product.quantity" class="item_quant">
                <input class="btn btn_qtd" id="btn_del_${produto.id}" type="button" value='-'/>
                <input id="quant-${produto.id}" name="quant" class="text_qtd" size="1" type="text" value="1" maxlength="5" />
                <input class="btn btn_qtd" id="btn_add_${produto.id}" type="button" value='+'/>
            </div>
            <p id="total-${produto.id}" class="pedido_total_produto">R$ ${produto.valor}</p>
        `;
        pedidoItens.appendChild(pedidoProduto);
    }

    var btnAddItem = document.getElementById(`btn_add_${produto.id}`);
    btnAddItem.onclick = function() {processarQuantidade(1, produto.id)};

    var btnDelItem = document.getElementById(`btn_del_${produto.id}`);
    btnDelItem.onclick = function() {processarQuantidade(-1, produto.id)};

    atualizarTotal();
}

// Função para processar as quantidades
function processarQuantidade(delta, produtoId) {
    const inputQuantidade = document.getElementById(`quant-${produtoId}`);
    let quantidade = parseInt(inputQuantidade.value) + delta;

    if (quantidade < 1) {
        // Se a quantidade for zero, remove o item do pedido
        const produtoElement = document.getElementById(`item_quant-${produtoId}`);
        if (produtoElement) {
            produtoElement.remove();
        }
    } else {
        // Atualiza a quantidade no input
        inputQuantidade.value = quantidade;
        const produto = produtos.find(p => p.id === produtoId);
        const subtotal = quantidade * parseFloat(produto.valor);
        document.getElementById(`total-${produtoId}`).textContent = `R$ ${subtotal.toFixed(2)}`;
    }

    atualizarTotal();
}

// Função para atualizar o total do pedido
function atualizarTotal() {
    let total = 0;
    document.querySelectorAll('.pedido_total_produto').forEach(item => {
        total += parseFloat(item.textContent.replace('R$', ''));
    });
    document.getElementById('total_pedido').textContent = `R$ ${total.toFixed(2)}`;
}

// Função para limpar o pedido
function limparPedido() {
    document.querySelector('.pedido_itens').innerHTML = '';
    atualizarTotal();
}

function fecharPedido() {
    const pedidoItens = document.querySelectorAll('.pedido_produto');

    pedidoItens.forEach(item => {
        const id = item.id.split('-')[1];
        const quantidade = parseInt(item.querySelector('.text_qtd').value);

        pedidoAtual.push({ id: id, quantidade: quantidade });
    });

    var idPedido = pedido.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    var now = new Date();
    var dataHora = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    var valorPedido = document.getElementById('total_pedido').textContent.match(/\d+\.?\d*/)[0];
    pedido.push({ id: idPedido, valor: valorPedido, dataHora: dataHora });

    pedidoAtual.forEach(pItem => {
        var idPedidoItem = pedido_item.reduce((max, item) => Math.max(max, item.id), 0) + 1;
        var valorItem = pItem.quantidade * produtos.find((element) => element.id==pItem.id).valor;
        pedido_item.push({ id: idPedidoItem, id_pedido: idPedido, id_produto: pItem.id, quantidade: pItem.quantidade, valor_total: valorItem});
    })
    
    limparPedido();

    alert(`Pedido nº ${idPedido} realizado com sucesso. Seu número será chamado em breve`);
    
}

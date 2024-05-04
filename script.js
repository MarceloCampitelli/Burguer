// Array de produtos
const produtos = [
    { "id": "1", "nome": "Burguer nº 1", "tipo": "hamburguer", "valor": "29.00" },
    { "id": "2", "nome": "Burguer nº 2", "tipo": "hamburguer", "valor": "35.00" },
    { "id": "3", "nome": "Burguer nº 3", "tipo": "hamburguer", "valor": "39.00" },
    { "id": "4", "nome": "Onion Rings", "tipo": "acompanhamento", "valor": "13.00" },
    { "id": "5", "nome": "Batata Frita M", "tipo": "acompanhamento", "valor": "9.00" },
    { "id": "6", "nome": "Batata Frita G", "tipo": "acompanhamento", "valor": "15.00" },
    { "id": "7", "nome": "Coca-cola", "tipo": "bebida", "valor": "7.00" },
    { "id": "8", "nome": "Sprite", "tipo": "bebida", "valor": "5.00" },
    { "id": "9", "nome": "Fanta", "tipo": "bebida", "valor": "5.00" },
    { "id": "10", "nome": "Milkshake", "tipo": "sobremesa", "valor": "18.00" },
    { "id": "11", "nome": "Açaí", "tipo": "sobremesa", "valor": "15.00" },
    { "id": "12", "nome": "Brownie", "tipo": "sobremesa", "valor": "7.00" },
];

pedido = [];

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
        pedidoProduto.className = 'pedido_produto ';
        pedidoProduto.id = `item_quant-${produto.id}`;
        pedidoProduto.innerHTML = `
            <p class="pedido_nome_produto">${produto.nome}</p>
            <div data-app="product.quantity" class="item_quant">
                <input class="btn btn_qtd" type="button" value='-' onclick="processarQuantidade(-1, '${produto.id}')" />
                <input id="quant-${produto.id}" name="quant" class="text_qtd" size="1" type="text" value="1" maxlength="5" />
                <input class="btn btn_qtd" type="button" value='+' onclick="processarQuantidade(1, '${produto.id}')">
            </div>
            <p id="total-${produto.id}" class="pedido_total_produto">R$ ${produto.valor}</p>
        `;
        pedidoItens.appendChild(pedidoProduto);
    }

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

import { pedido, pedido_item, produtos } from './modulo.js';

const modal = document.getElementById("myModal");

$(document).ready(function(){
    $("#content div:nth-child(1)").show();
    $(".abas li:first div").addClass("selected");
    $(".aba").click(function(){
        $(".aba").removeClass("selected");
        $(this).addClass("selected");
        var indice = $(this).parent().index();
        indice++;
        $("#content div").hide();
        $("#content div:nth-child("+indice+")").show();
    });

    $(".aba").hover(
        function(){$(this).addClass("ativa")},
        function(){$(this).removeClass("ativa")}
    );
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebarIcons = document.querySelectorAll('.sidebar .item_menu');
    const scrollContainer = document.querySelector('.TabControl');

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

    var ped = document.getElementById('menu_produto');
    if (ped) {
        ped.addEventListener('click', gridProdutos());
    }

    var el = document.getElementById('menu_pedido');
    if (el) {
        el.addEventListener('click', grid());
    }

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
});

function gridProdutos() {
    const tbody = document.getElementById('corpoTabelaProdutos');
    tbody.innerHTML = '';

    let total = 0;

    produtos.forEach(item => {
        const tr = document.createElement('tr');
        //tr.onclick = function() {openModal(tr.id);};
        tr.id = item.id;
        tr.innerHTML = `
            <th class="col_1" scope="row">${item.id}</th>
            <td class="col_2">R$ ${item.nome}</td>
            <td class="col_3">${item.tipo}</td>
            <td class="col_4">${item.valor}</td>
        `;
        tbody.appendChild(tr);

        const valorLimpo = parseFloat(item.valor.replace('R$', '').replace(',', '.'));
        total += valorLimpo;
    });

    const totalValor = document.getElementById('totalValor');
    totalValor.textContent = `R$ ${total.toFixed(2)}`;
}

function grid() {
    const tbody = document.getElementById('corpoTabela');
    tbody.innerHTML = '';

    let total = 0;

    pedido.forEach(item => {
        const tr = document.createElement('tr');
        tr.onclick = function() {openModal(tr.id);};
        tr.id = item.id;
        tr.innerHTML = `
            <th class="col_1" scope="row">${item.id}</th>
            <td class="col_2">R$ ${item.valor}</td>
            <td class="col_3">${item.dataHora}</td>
        `;
        tbody.appendChild(tr);

        const valorLimpo = parseFloat(item.valor.replace('R$', '').replace(',', '.'));
        total += valorLimpo;
    });

    const totalValor = document.getElementById('totalValor');
    totalValor.textContent = `R$ ${total.toFixed(2)}`;
}

function openModal(id) {
    var modalContent = document.getElementById("modal_content");
    modalContent.style.display = "block";
    modal.style.display = "block";
    
    var tituloModal = document.getElementById("titulo_pedido");
    tituloModal.textContent =` Pedido nº ${id}`;
    gridItens(id);
}

function gridItens(id) {
    const listaItens = document.getElementById('lista_itens');
    listaItens.innerHTML = '';
    var totalPedido = 0;

    const itensPedido = pedido_item.filter(product => product.id_pedido == id);

    itensPedido.forEach(item => {
        var nome = (produtos.find(pr => pr.id == item.id_produto)).nome;
        var valor = (produtos.find(pr => pr.id == item.id_produto)).valor;

        const nav = document.createElement('nav');
        nav.className = "item_pedido";
        nav.innerHTML = `
            <p class="cod_item">${item.id_produto}</p>
            <p class="nome_item">${nome}</p>
            <p class="quant_valor">${item.quantidade} x R$ ${valor}</p>
            <p class="total_item">R$ ${item.valor_total}</p>
        `;

        totalPedido += item.valor_total;

        listaItens.appendChild(nav);
    });

    const totalEmTela = document.getElementById('total_pedido');
    totalEmTela.textContent = `Total: R$ ${totalPedido}`;
}

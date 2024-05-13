
import { pedido, pedido_item, produtos } from './modulo.js';

const modalPedido = document.getElementById("modalPedidos");

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

    var btnExport = document.getElementById('exportarExcel');
    btnExport.onclick = () => exportReportToExcel();

    var el = document.getElementById('menu_pedido');
    if (el) {
        el.addEventListener('click', grid());
    }

    var spanPedido = document.getElementsByClassName("close_pedido")[0];
    spanPedido.onclick = function() {
        modalPedido.style.display = "none";
    }

});

document.getElementById('gerarPDF').addEventListener('click', function() {
    // Criar um novo documento PDF
    var doc = new jsPDF();

    // Adicionar cabeçalho com título e data
    var titulo = "Relatório de Pedidos";
    var data = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(18);
    doc.text(titulo, 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text("Data de Geração: " + data, 105, 30, null, null, "center");
    
    // Adicionar conteúdo da tabela
    var table = document.getElementById("tabela_pedidos");
    var rows = table.rows;
    var columnCount = table.rows[0].cells.length;
    var cellWidth = 180 / columnCount; // Ajuste o valor de 180 para o tamanho total da folha menos a margem
    
    var yPos = 50; // Posição vertical inicial da tabela no PDF

    for(var i = 0; i < rows.length; i++) {
        if (i < (rows.length - 1)) {
            var cells = rows[i].cells;
            var xPos = 10; // Posição horizontal inicial da tabela no PDF

            for(var j = 0; j < cells.length; j++) {
                var text = cells[j].innerText;
                var cellHeight = 10; // Altura da célula
                var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize(); // Largura do texto

                // Adiciona borda ao redor da célula
                doc.rect(xPos, yPos - cellHeight, cellWidth, cellHeight);

                // Adiciona texto à célula
                doc.text(xPos + 3, yPos - 3, text);

                xPos += cellWidth; // Atualiza a posição horizontal para a próxima célula
            }
            yPos += cellHeight; // Atualiza a posição vertical para a próxima linha
        }
    }

    // Atualiza a altura da última linha para se ajustar ao texto
    yPos += 5;

    // Adiciona a linha de total
    doc.rect(10, yPos, cellWidth * columnCount, cellHeight);
    doc.text("Total", 15, yPos + 8); // Texto "Total"
    doc.text(document.getElementById("totalValor").innerText, cellWidth * 2 + 15, yPos + 8); // Valor total

    // Salvar o PDF no navegador
    doc.save("relatorio_pedidos.pdf");

    // Para evitar que o PDF seja salvo automaticamente
    return false;
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
            <td class="col_2">${item.nome}</td>
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
    modalPedido.style.display = "block";
    
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

function exportReportToExcel() {
    const fileName = 'tabela_pedidos.xlsx';
    const table = document.getElementById("tabela_pedidos");
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, fileName);
}
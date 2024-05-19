package br.com.burguer_api.burguer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import br.com.burguer_api.burguer.DAO.PedidoInterface;
import br.com.burguer_api.burguer.DAO.PedidoItemInterface;
import br.com.burguer_api.burguer.DAO.ProdutoInterface;
import br.com.burguer_api.burguer.model.Pedidos;
import br.com.burguer_api.burguer.model.Produtos;
import br.com.burguer_api.burguer.model.PedidoItem;
import br.com.burguer_api.burguer.dto.PedidoDTO;
import br.com.burguer_api.burguer.dto.PedidoItemDTO;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class pedidosEP {

    @Autowired
    private PedidoInterface pedidoDao;

    @Autowired
    private PedidoItemInterface pedidoItemDao;
    
    @Autowired
    private ProdutoInterface produtoDao;
    
    @GetMapping
    public ResponseEntity<List<Pedidos>> listaPedidos() {
        List<Pedidos> lista = (List<Pedidos>) pedidoDao.findAll();
        return ResponseEntity.status(200).body(lista);
    }

    @PostMapping
    public ResponseEntity<?> fecharPedido(@RequestBody PedidoDTO pedidoDTO) {
        try {
            Pedidos pedido = new Pedidos();
            pedido.setValor(pedidoDTO.getValor());
            pedido.setDataHora(LocalDateTime.now());
            pedido = pedidoDao.save(pedido);

            for (PedidoItemDTO itemDTO : pedidoDTO.getItens()) {
                PedidoItem item = new PedidoItem();
                item.setId_pedido(pedido.getId());
                item.setId_produto(itemDTO.getIdProduto());
                item.setQuantidade(itemDTO.getQuantidade());

                Produtos produto = produtoDao.findById(itemDTO.getIdProduto())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado: ID " + itemDTO.getIdProduto()));
                double valorTotal = itemDTO.getQuantidade() * produto.getValor();

                item.setValor_total(valorTotal);
                pedidoItemDao.save(item);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("message", "Erro ao fechar pedido: " + e.getMessage()));
        }
    }
}

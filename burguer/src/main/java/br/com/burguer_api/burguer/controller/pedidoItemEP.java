package br.com.burguer_api.burguer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.burguer_api.burguer.DAO.PedidoItemInterface;
import br.com.burguer_api.burguer.model.PedidoItem;

@RestController
@CrossOrigin("*")
@RequestMapping("/pedidoItem")
public class pedidoItemEP {

	@Autowired
	private PedidoItemInterface dao;
	
	@GetMapping
	public ResponseEntity<List<PedidoItem>> ItemPedido () {
		List<PedidoItem> lista = (List<PedidoItem>) dao.findAll();
		return ResponseEntity.status(200).body(lista);
	}
	
	@PostMapping
	public PedidoItem addPedidoItem(@RequestBody PedidoItem item) {
		PedidoItem novoItem = dao.save(item);
		return novoItem;
	}
}

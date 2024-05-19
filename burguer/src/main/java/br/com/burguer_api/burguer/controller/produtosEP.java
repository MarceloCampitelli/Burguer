package br.com.burguer_api.burguer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.burguer_api.burguer.DAO.ProdutoInterface;
import br.com.burguer_api.burguer.model.Produtos;

@RestController
@RequestMapping("/produtos")
public class produtosEP {
	
	@Autowired
	private ProdutoInterface dao;
	
	@GetMapping
	public ResponseEntity<List<Produtos>> listaProdutos () {
		List<Produtos> lista = (List<Produtos>) dao.findAll();
		return ResponseEntity.status(200).body(lista);
	}
}

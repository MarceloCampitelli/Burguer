package br.com.burguer_api.burguer.DAO;

import org.springframework.data.repository.CrudRepository;

import br.com.burguer_api.burguer.model.Pedidos;

public interface PedidoInterface extends CrudRepository<Pedidos, Long>{

}

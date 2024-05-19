package br.com.burguer_api.burguer.DAO;

import org.springframework.data.repository.CrudRepository;

import br.com.burguer_api.burguer.model.PedidoItem;

public interface PedidoItemInterface extends CrudRepository<PedidoItem, Long>{

}

package br.com.burguer_api.burguer.DAO;

import org.springframework.data.repository.CrudRepository;
import br.com.burguer_api.burguer.model.Produtos;

public interface ProdutoInterface extends CrudRepository<Produtos, Long> {
}

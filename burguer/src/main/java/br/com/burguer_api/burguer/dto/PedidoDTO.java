package br.com.burguer_api.burguer.dto;

import java.util.List;

public class PedidoDTO {
    private double valor;
    private List<PedidoItemDTO> itens;

    // Getters e Setters
    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public List<PedidoItemDTO> getItens() {
        return itens;
    }

    public void setItens(List<PedidoItemDTO> itens) {
        this.itens = itens;
    }
}
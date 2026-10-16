package recode.leandrocrisci.projetofinal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "escolaid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Escola escola;

    @ManyToOne
    @JoinColumn(name = "produtoid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "professorid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Professor professor;

    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    @Column(nullable = false)
    private Integer quantidade;

    @NotNull(message = "Valor unitário é obrigatório")
    @Column(name = "valorunitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorUnitario;

    @Column(name = "datapedido", nullable = false)
    private LocalDateTime dataPedido;

    @Column(name = "statuspedido", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusPedido statusPedido = StatusPedido.processando;

    public enum StatusPedido {
        processando, enviado, entregue, cancelado
    }

    public Pedido() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Escola getEscola() { return escola; }
    public void setEscola(Escola escola) { this.escola = escola; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Professor getProfessor() { return professor; }
    public void setProfessor(Professor professor) { this.professor = professor; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public BigDecimal getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(BigDecimal valorUnitario) { this.valorUnitario = valorUnitario; }

    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }

    // valortotal é calculado pelo banco (coluna gerada), não mapeada aqui

    public StatusPedido getStatusPedido() { return statusPedido; }
    public void setStatusPedido(StatusPedido statusPedido) { this.statusPedido = statusPedido; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Pedido p)) return false;
        return Objects.equals(id, p.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

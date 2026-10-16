package recode.leandrocrisci.projetofinal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "matriculas")
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alunoid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "matriculas"})
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "cursoid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "matriculas"})
    private Curso curso;

    @Column(nullable = false)
    private LocalDateTime dataMatricula;

    @NotNull(message = "Valor pago é obrigatório")
    @Positive(message = "Valor pago deve ser positivo")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPago;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusPagamento statusPagamento = StatusPagamento.pendente;

    public enum StatusPagamento {
        pago, pendente, cancelado
    }

    public Matricula() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public LocalDateTime getDataMatricula() { return dataMatricula; }
    public void setDataMatricula(LocalDateTime dataMatricula) { this.dataMatricula = dataMatricula; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }

    public StatusPagamento getStatusPagamento() { return statusPagamento; }
    public void setStatusPagamento(StatusPagamento statusPagamento) { this.statusPagamento = statusPagamento; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Matricula m)) return false;
        return Objects.equals(id, m.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

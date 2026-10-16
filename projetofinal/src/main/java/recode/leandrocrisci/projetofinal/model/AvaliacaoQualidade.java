package recode.leandrocrisci.projetofinal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "avaliacoesqualidade")
public class AvaliacaoQualidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Nota é obrigatória")
    @Min(value = 1, message = "Nota mínima é 1")
    @Max(value = 5, message = "Nota máxima é 5")
    @Column(nullable = false)
    private Integer nota;

    @Column(length = 500)
    private String comentario;

    @Column
    private LocalDate dataAvaliacao;

    @ManyToOne
    @JoinColumn(name = "escola_id", nullable = false) // <-- Altere de escolaid para escola_id
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Escola escola;

    public AvaliacaoQualidade() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDate getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDate dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

    public Escola getEscola() { return escola; }
    public void setEscola(Escola escola) { this.escola = escola; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AvaliacaoQualidade a)) return false;
        return Objects.equals(id, a.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

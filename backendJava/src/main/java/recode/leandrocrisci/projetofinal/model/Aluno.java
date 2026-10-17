package recode.leandrocrisci.projetofinal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Objects;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Área residencial (urbana/rural) é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('urbana', 'rural')", nullable = false)
    private AreaResidencial area;

    @Column(name = "distancia_escola", precision = 5, scale = 2)
    private BigDecimal distanciaEscola;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_transporte", columnDefinition = "ENUM('a_pe', 'transporte_escolar', 'transporte_publico', 'proprio')")
    private TipoTransporte tipoTransporte;

    @Column(name = "tempo_deslocamento_minutos")
    private Integer tempoDeslocamentoMinutos;

    @ManyToOne
    @JoinColumn(name = "cursoid")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "escolaid")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Escola escola;

    // Enums declarados como subclasses para manter o arquivo único e organizado
    public enum AreaResidencial {
        urbana, rural
    }

    public enum TipoTransporte {
        a_pe, transporte_escolar, transporte_publico, proprio
    }

    public Aluno() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AreaResidencial getArea() { return area; }
    public void setArea(AreaResidencial area) { this.area = area; }

    public BigDecimal getDistanciaEscola() { return distanciaEscola; }
    public void setDistanciaEscola(BigDecimal distanciaEscola) { this.distanciaEscola = distanciaEscola; }

    public TipoTransporte getTipoTransporte() { return tipoTransporte; }
    public void setTipoTransporte(TipoTransporte tipoTransporte) { this.tipoTransporte = tipoTransporte; }

    public Integer getTempoDeslocamentoMinutos() { return tempoDeslocamentoMinutos; }
    public void setTempoDeslocamentoMinutos(Integer tempoDeslocamentoMinutos) { this.tempoDeslocamentoMinutos = tempoDeslocamentoMinutos; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public Escola getEscola() { return escola; }
    public void setEscola(Escola escola) { this.escola = escola; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Aluno a)) return false;
        return Objects.equals(id, a.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }

    @Override
    public String toString() {
        return "Aluno{" +
                "id=" + id +
                ", area=" + area +
                ", distanciaEscola=" + distanciaEscola +
                '}';
    }
}

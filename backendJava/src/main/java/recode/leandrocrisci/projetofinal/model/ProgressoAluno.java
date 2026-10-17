package recode.leandrocrisci.projetofinal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "progressosalunos")
public class ProgressoAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alunoid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "progressos"})
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "cursoid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "progressos"})
    private Curso curso;

    @NotNull(message = "Percentual de conclusão é obrigatório")
    @Min(value = 0, message = "Percentual mínimo é 0")
    @Max(value = 100, message = "Percentual máximo é 100")
    @Column(nullable = false)
    private Integer percentualConclusao = 0;

    @Column(nullable = false)
    private LocalDateTime dataAtualizacao;

    public ProgressoAluno() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }

    public Integer getPercentualConclusao() { return percentualConclusao; }
    public void setPercentualConclusao(Integer percentualConclusao) { this.percentualConclusao = percentualConclusao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProgressoAluno p)) return false;
        return Objects.equals(id, p.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

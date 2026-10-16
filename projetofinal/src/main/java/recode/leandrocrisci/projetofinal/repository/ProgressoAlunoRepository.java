package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.ProgressoAluno;

import java.util.List;

@Repository
public interface ProgressoAlunoRepository extends JpaRepository<ProgressoAluno, Long> {

    List<ProgressoAluno> findByAlunoId(Long alunoId);

    List<ProgressoAluno> findByCursoId(Long cursoId);
}

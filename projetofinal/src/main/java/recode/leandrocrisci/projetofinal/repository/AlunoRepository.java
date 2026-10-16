package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.Aluno;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    // List<Aluno> findByNomeContainingIgnoreCase(String nome);

    List<Aluno> findByCursoId(Long cursoId);

    List<Aluno> findByEscolaId(Long escolaId);

    List<Aluno> findByArea(Aluno.AreaResidencial area);

}

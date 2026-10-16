package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.AvaliacaoCurso;
import java.util.List;

@Repository
public interface AvaliacaoCursoRepository extends JpaRepository<AvaliacaoCurso, Long> {
    List<AvaliacaoCurso> findByCursoId(Long cursoId);
}

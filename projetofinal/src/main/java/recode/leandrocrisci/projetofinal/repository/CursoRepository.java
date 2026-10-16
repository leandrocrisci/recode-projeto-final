package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.Curso;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    List<Curso> findByNomeContainingIgnoreCase(String nome);

    List<Curso> findByEscolaId(Long escolaId);
}

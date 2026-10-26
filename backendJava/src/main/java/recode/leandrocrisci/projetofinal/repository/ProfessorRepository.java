package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.Professor;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    List<Professor> findByNomeContainingIgnoreCase(String nome);

    List<Professor> findByEscolaId(Long escolaId);

    /** Login: só professores com senha (administradores). */
    Optional<Professor> findFirstByEmailIgnoreCaseAndSenhaHashIsNotNull(String email);

    Optional<Professor> findFirstByEmailIgnoreCase(String email);
}

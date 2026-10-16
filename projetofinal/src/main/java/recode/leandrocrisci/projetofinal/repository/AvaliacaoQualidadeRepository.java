package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.AvaliacaoQualidade;

import java.util.List;

@Repository
public interface AvaliacaoQualidadeRepository extends JpaRepository<AvaliacaoQualidade, Long> {

    List<AvaliacaoQualidade> findByEscolaId(Long escolaId);
}

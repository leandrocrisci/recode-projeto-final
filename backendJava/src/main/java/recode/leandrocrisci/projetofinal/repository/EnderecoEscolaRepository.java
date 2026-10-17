package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.EnderecoEscola;

import java.util.Optional;

@Repository
public interface EnderecoEscolaRepository extends JpaRepository<EnderecoEscola, Long> {
    // Alinhado para retornar Optional devido ao mapeamento OneToOne
    Optional<EnderecoEscola> findByEscolaId(Long escolaId);
}
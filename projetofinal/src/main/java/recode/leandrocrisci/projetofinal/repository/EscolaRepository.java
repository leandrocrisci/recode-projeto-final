package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.Escola;

import java.util.List;

@Repository
public interface EscolaRepository extends JpaRepository<Escola, Long> {

    List<Escola> findByNomeContainingIgnoreCase(String nome);

    List<Escola> findByTipo(String tipo);
}

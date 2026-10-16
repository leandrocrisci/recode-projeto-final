package recode.leandrocrisci.projetofinal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import recode.leandrocrisci.projetofinal.model.Pedido;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByEscolaId(Long escolaId);

    List<Pedido> findByStatusPedido(Pedido.StatusPedido status);

    List<Pedido> findByProfessorId(Long professorId);
}

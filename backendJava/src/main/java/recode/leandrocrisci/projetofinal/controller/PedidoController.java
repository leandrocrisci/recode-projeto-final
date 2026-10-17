package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.Pedido;
import recode.leandrocrisci.projetofinal.service.PedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @GetMapping("/escola/{escolaId}")
    public ResponseEntity<List<Pedido>> buscarPorEscola(@PathVariable Long escolaId) {
        return ResponseEntity.ok(pedidoService.buscarPorEscola(escolaId));
    }

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<List<Pedido>> buscarPorProfessor(@PathVariable Long professorId) {
        return ResponseEntity.ok(pedidoService.buscarPorProfessor(professorId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Pedido>> buscarPorStatus(
            @PathVariable Pedido.StatusPedido status) {
        return ResponseEntity.ok(pedidoService.buscarPorStatus(status));
    }

    @PostMapping("/escola/{escolaId}/produto/{produtoId}/professor/{professorId}")
    public ResponseEntity<Pedido> criar(@PathVariable Long escolaId,
                                        @PathVariable Long produtoId,
                                        @PathVariable Long professorId,
                                        @Valid @RequestBody Pedido pedido) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pedidoService.salvar(escolaId, produtoId, professorId, pedido));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> atualizar(@PathVariable Long id,
                                            @Valid @RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.atualizar(id, pedido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

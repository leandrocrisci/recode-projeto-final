package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.service.EscolaService;

import java.util.List;

@RestController
@RequestMapping("/api/escolas")
public class EscolaController {

    private final EscolaService escolaService;

    public EscolaController(EscolaService escolaService) {
        this.escolaService = escolaService;
    }

    @GetMapping
    public ResponseEntity<List<Escola>> listarTodas() {
        return ResponseEntity.ok(escolaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Escola> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(escolaService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Escola>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(escolaService.buscarPorNome(nome));
    }

    @GetMapping("/tipo")
    public ResponseEntity<List<Escola>> buscarPorTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(escolaService.buscarPorTipo(tipo));
    }

    @PostMapping
    public ResponseEntity<Escola> criar(@Valid @RequestBody Escola escola) {
        return ResponseEntity.status(HttpStatus.CREATED).body(escolaService.salvar(escola));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Escola> atualizar(@PathVariable Long id,
                                             @Valid @RequestBody Escola escola) {
        return ResponseEntity.ok(escolaService.atualizar(id, escola));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        escolaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

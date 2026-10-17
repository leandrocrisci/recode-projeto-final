package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.Curso;
import recode.leandrocrisci.projetofinal.service.CursoService;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    private final CursoService cursoService;

    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    @GetMapping
    public ResponseEntity<List<Curso>> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Curso>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(cursoService.buscarPorNome(nome));
    }

    @GetMapping("/escola/{escolaId}")
    public ResponseEntity<List<Curso>> buscarPorEscola(@PathVariable Long escolaId) {
        return ResponseEntity.ok(cursoService.buscarPorEscola(escolaId));
    }

    @PostMapping("/escola/{escolaId}")
    public ResponseEntity<Curso> criar(@PathVariable Long escolaId,
                                        @Valid @RequestBody Curso curso) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cursoService.salvar(escolaId, curso));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> atualizar(@PathVariable Long id,
                                            @Valid @RequestBody Curso curso) {
        return ResponseEntity.ok(cursoService.atualizar(id, curso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        cursoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

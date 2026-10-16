package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.service.ProfessorService;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping
    public ResponseEntity<List<Professor>> listarTodos() {
        return ResponseEntity.ok(professorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Professor>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(professorService.buscarPorNome(nome));
    }

    @GetMapping("/escola/{escolaId}")
    public ResponseEntity<List<Professor>> buscarPorEscola(@PathVariable Long escolaId) {
        return ResponseEntity.ok(professorService.buscarPorEscola(escolaId));
    }

    @PostMapping("/escola/{escolaId}")
    public ResponseEntity<Professor> criar(@PathVariable Long escolaId,
                                           @Valid @RequestBody Professor professor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(professorService.salvar(escolaId, professor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizar(@PathVariable Long id,
                                               @Valid @RequestBody Professor professor) {
        return ResponseEntity.ok(professorService.atualizar(id, professor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        professorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

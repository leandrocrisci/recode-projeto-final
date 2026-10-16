package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.ProgressoAluno;
import recode.leandrocrisci.projetofinal.service.ProgressoAlunoService;

import java.util.List;

@RestController
@RequestMapping("/api/progressos")
public class ProgressoAlunoController {

    private final ProgressoAlunoService progressoService;

    public ProgressoAlunoController(ProgressoAlunoService progressoService) {
        this.progressoService = progressoService;
    }

    @GetMapping
    public ResponseEntity<List<ProgressoAluno>> listarTodos() {
        return ResponseEntity.ok(progressoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressoAluno> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(progressoService.buscarPorId(id));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<ProgressoAluno>> buscarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(progressoService.buscarPorAluno(alunoId));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<ProgressoAluno>> buscarPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(progressoService.buscarPorCurso(cursoId));
    }

    @PostMapping("/aluno/{alunoId}/curso/{cursoId}")
    public ResponseEntity<ProgressoAluno> criar(@PathVariable Long alunoId,
                                                @PathVariable Long cursoId,
                                                @Valid @RequestBody ProgressoAluno progresso) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(progressoService.salvar(alunoId, cursoId, progresso));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressoAluno> atualizar(@PathVariable Long id,
                                                    @Valid @RequestBody ProgressoAluno progresso) {
        return ResponseEntity.ok(progressoService.atualizar(id, progresso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        progressoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

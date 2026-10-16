package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.Matricula;
import recode.leandrocrisci.projetofinal.service.MatriculaService;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
public class MatriculaController {

    private final MatriculaService matriculaService;

    public MatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @GetMapping
    public ResponseEntity<List<Matricula>> listarTodas() {
        return ResponseEntity.ok(matriculaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matricula> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(matriculaService.buscarPorId(id));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<Matricula>> buscarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(matriculaService.buscarPorAluno(alunoId));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Matricula>> buscarPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(matriculaService.buscarPorCurso(cursoId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Matricula>> buscarPorStatus(
            @PathVariable Matricula.StatusPagamento status) {
        return ResponseEntity.ok(matriculaService.buscarPorStatus(status));
    }

    @PostMapping("/aluno/{alunoId}/curso/{cursoId}")
    public ResponseEntity<Matricula> criar(@PathVariable Long alunoId,
                                           @PathVariable Long cursoId,
                                           @Valid @RequestBody Matricula matricula) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(matriculaService.salvar(alunoId, cursoId, matricula));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matricula> atualizar(@PathVariable Long id,
                                               @Valid @RequestBody Matricula matricula) {
        return ResponseEntity.ok(matriculaService.atualizar(id, matricula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        matriculaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.Aluno;
import recode.leandrocrisci.projetofinal.service.AlunoService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    public ResponseEntity<List<Aluno>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

     @GetMapping("/buscar")
    public ResponseEntity<List<Aluno>> buscarPorArea(@RequestParam Aluno.AreaResidencial area) {
        return ResponseEntity.ok(alunoService.buscarPorArea(area));
    }


    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Aluno>> buscarPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(alunoService.buscarPorCurso(cursoId));
    }

    @GetMapping("/escola/{escolaId}")
    public ResponseEntity<List<Aluno>> buscarPorEscola(@PathVariable Long escolaId) {
        return ResponseEntity.ok(alunoService.buscarPorEscola(escolaId));
    }

    @PostMapping
    public ResponseEntity<Aluno> criar(@Valid @RequestBody Aluno aluno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alunoService.salvar(aluno));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aluno> atualizar(@PathVariable Long id,
                                            @Valid @RequestBody Aluno aluno) {
        return ResponseEntity.ok(alunoService.atualizar(id, aluno));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

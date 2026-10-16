package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.dto.AvaliacaoCursoRequest;
import recode.leandrocrisci.projetofinal.model.AvaliacaoCurso;
import recode.leandrocrisci.projetofinal.service.AvaliacaoCursoService;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes-cursos")
public class AvaliacaoCursoController {

    private final AvaliacaoCursoService avaliacaoCursoService;

    public AvaliacaoCursoController(AvaliacaoCursoService avaliacaoCursoService) {
        this.avaliacaoCursoService = avaliacaoCursoService;
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoCurso>> listarTodas() {
        return ResponseEntity.ok(avaliacaoCursoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoCurso> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(avaliacaoCursoService.buscarPorId(id));
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<AvaliacaoCurso>> buscarPorCurso(@PathVariable Long cursoId) {
        return ResponseEntity.ok(avaliacaoCursoService.buscarPorCurso(cursoId));
    }

    @PostMapping("/curso/{cursoId}")
    public ResponseEntity<AvaliacaoCurso> criar(@PathVariable Long cursoId,
                                                @Valid @RequestBody AvaliacaoCursoRequest dto) {
        AvaliacaoCurso avaliacao = new AvaliacaoCurso();
        avaliacao.setNota(dto.nota());
        avaliacao.setObservacao(dto.observacao());
        avaliacao.setDataAvaliacao(dto.dataAvaliacao());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(avaliacaoCursoService.salvar(cursoId, avaliacao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoCurso> atualizar(@PathVariable Long id,
                                                    @Valid @RequestBody AvaliacaoCursoRequest dto) {
        AvaliacaoCurso dados = new AvaliacaoCurso();
        dados.setNota(dto.nota());
        dados.setObservacao(dto.observacao());
        dados.setDataAvaliacao(dto.dataAvaliacao());
        
        return ResponseEntity.ok(avaliacaoCursoService.atualizar(id, dados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avaliacaoCursoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

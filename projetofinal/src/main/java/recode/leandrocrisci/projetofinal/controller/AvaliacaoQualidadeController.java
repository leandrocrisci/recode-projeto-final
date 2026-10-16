package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import recode.leandrocrisci.projetofinal.dto.AvaliacaoQualidadeRequest;
import recode.leandrocrisci.projetofinal.model.AvaliacaoQualidade;
import recode.leandrocrisci.projetofinal.service.AvaliacaoQualidadeService;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes-qualidade")
public class AvaliacaoQualidadeController {

    private final AvaliacaoQualidadeService avaliacaoQualidadeService;

    public AvaliacaoQualidadeController(AvaliacaoQualidadeService avaliacaoQualidadeService) {
        this.avaliacaoQualidadeService = avaliacaoQualidadeService;
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoQualidade>> listarTodas() {
        return ResponseEntity.ok(avaliacaoQualidadeService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoQualidade> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(avaliacaoQualidadeService.buscarPorId(id));
    }

    @GetMapping("/escola/{escolaId}")
    public ResponseEntity<List<AvaliacaoQualidade>> buscarPorEscola(@PathVariable Long escolaId) {
        return ResponseEntity.ok(avaliacaoQualidadeService.buscarPorEscola(escolaId));
    }

    //@PostMapping("/escola/{escolaId}")
    //public ResponseEntity<AvaliacaoQualidade> criar(@PathVariable Long escolaId,
    //                                                 @Valid @RequestBody AvaliacaoQualidade avaliacao) {
    //    return ResponseEntity.status(HttpStatus.CREATED)
    //            .body(avaliacaoQualidadeService.salvar(escolaId, avaliacao));
    //}
    // Modifique o endpoint de criação para usar o seu novo DTO:
@PostMapping("/escola/{escolaId}")
public ResponseEntity<AvaliacaoQualidade> criar(@PathVariable Long escolaId,
                                                 @Valid @RequestBody AvaliacaoQualidadeRequest dto) {
    // Convertemos o DTO para a entidade antes de passar para o Service
    AvaliacaoQualidade avaliacao = new AvaliacaoQualidade();
    avaliacao.setNota(dto.nota());
    avaliacao.setComentario(dto.comentario());
    avaliacao.setDataAvaliacao(dto.dataAvaliacao());

    return ResponseEntity.status(HttpStatus.CREATED)
            .body(avaliacaoQualidadeService.salvar(escolaId, avaliacao));
}


    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoQualidade> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody AvaliacaoQualidade avaliacao) {
        return ResponseEntity.ok(avaliacaoQualidadeService.atualizar(id, avaliacao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avaliacaoQualidadeService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

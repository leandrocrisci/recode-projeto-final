package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import recode.leandrocrisci.projetofinal.model.EnderecoEscola;
import recode.leandrocrisci.projetofinal.service.EnderecoEscolaService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")

@RestController
@RequestMapping("/api/enderecos-escolas")
public class EnderecoEscolaController {

    private final EnderecoEscolaService enderecoEscolaService;

    public EnderecoEscolaController(EnderecoEscolaService enderecoEscolaService) {
        this.enderecoEscolaService = enderecoEscolaService;
    }

    @GetMapping
    public ResponseEntity<List<EnderecoEscola>> listarTodos() {
        return ResponseEntity.ok(enderecoEscolaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoEscola> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(enderecoEscolaService.buscarPorId(id));
    }

    @GetMapping("/escola/{escolaId}")
    public ResponseEntity<EnderecoEscola> buscarPorEscola(@PathVariable Long escolaId) {
        return ResponseEntity.ok(enderecoEscolaService.buscarPorEscola(escolaId));
    }


    @PostMapping("/escola/{escolaId}")
    public ResponseEntity<EnderecoEscola> criar(@PathVariable Long escolaId,
                                                 @Valid @RequestBody EnderecoEscola endereco) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enderecoEscolaService.salvar(escolaId, endereco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnderecoEscola> atualizar(@PathVariable Long id,
                                                     @Valid @RequestBody EnderecoEscola endereco) {
        return ResponseEntity.ok(enderecoEscolaService.atualizar(id, endereco));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        enderecoEscolaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

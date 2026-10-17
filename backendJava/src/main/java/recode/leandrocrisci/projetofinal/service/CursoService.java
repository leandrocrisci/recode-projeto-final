package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Curso;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.repository.CursoRepository;

import java.util.List;

@Service
public class CursoService {

    private final CursoRepository cursoRepository;
    private final EscolaService escolaService;

    public CursoService(CursoRepository cursoRepository, EscolaService escolaService) {
        this.cursoRepository = cursoRepository;
        this.escolaService = escolaService;
    }

    public List<Curso> listarTodos() {
        return cursoRepository.findAll();
    }

    public Curso buscarPorId(Long id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com id: " + id));
    }

    public List<Curso> buscarPorNome(String nome) {
        return cursoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Curso> buscarPorEscola(Long escolaId) {
        return cursoRepository.findByEscolaId(escolaId);
    }

    public Curso salvar(Long escolaId, Curso curso) {
        Escola escola = escolaService.buscarPorId(escolaId);
        curso.setEscola(escola);
        return cursoRepository.save(curso);
    }

    public Curso atualizar(Long id, Curso dados) {
        Curso curso = buscarPorId(id);
        curso.setNome(dados.getNome());
        curso.setDescricao(dados.getDescricao());
        curso.setCargaHoraria(dados.getCargaHoraria());
        return cursoRepository.save(curso);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        cursoRepository.deleteById(id);
    }
}

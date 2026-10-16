package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.AvaliacaoCurso;
import recode.leandrocrisci.projetofinal.model.Curso;
import recode.leandrocrisci.projetofinal.repository.AvaliacaoCursoRepository;
import java.util.List;

@Service
public class AvaliacaoCursoService {

    private final AvaliacaoCursoRepository avaliacaoCursoRepository;
    private final CursoService cursoService;

    public AvaliacaoCursoService(AvaliacaoCursoRepository avaliacaoCursoRepository, CursoService cursoService) {
        this.avaliacaoCursoRepository = avaliacaoCursoRepository;
        this.cursoService = cursoService;
    }

    public List<AvaliacaoCurso> listarTodas() {
        return avaliacaoCursoRepository.findAll();
    }

    public AvaliacaoCurso buscarPorId(Long id) {
        return avaliacaoCursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação de curso não encontrada com id: " + id));
    }

    public List<AvaliacaoCurso> buscarPorCurso(Long cursoId) {
        return avaliacaoCursoRepository.findByCursoId(cursoId);
    }

    public AvaliacaoCurso salvar(Long cursoId, AvaliacaoCurso avaliacao) {
        Curso curso = cursoService.buscarPorId(cursoId);
        avaliacao.setCurso(curso);
        return avaliacaoCursoRepository.save(avaliacao);
    }

    public AvaliacaoCurso atualizar(Long id, AvaliacaoCurso dados) {
        AvaliacaoCurso avaliacao = buscarPorId(id);
        avaliacao.setNota(dados.getNota());
        avaliacao.setObservacao(dados.getObservacao());
        avaliacao.setDataAvaliacao(dados.getDataAvaliacao());
        return avaliacaoCursoRepository.save(avaliacao);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        avaliacaoCursoRepository.deleteById(id);
    }
}

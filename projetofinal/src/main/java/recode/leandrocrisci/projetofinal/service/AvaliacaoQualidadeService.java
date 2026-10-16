package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.AvaliacaoQualidade;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.repository.AvaliacaoQualidadeRepository;

import java.util.List;

@Service
public class AvaliacaoQualidadeService {

    private final AvaliacaoQualidadeRepository avaliacaoQualidadeRepository;
    private final EscolaService escolaService;

    public AvaliacaoQualidadeService(AvaliacaoQualidadeRepository avaliacaoQualidadeRepository,
                                      EscolaService escolaService) {
        this.avaliacaoQualidadeRepository = avaliacaoQualidadeRepository;
        this.escolaService = escolaService;
    }

    public List<AvaliacaoQualidade> listarTodas() {
        return avaliacaoQualidadeRepository.findAll();
    }

    public AvaliacaoQualidade buscarPorId(Long id) {
        return avaliacaoQualidadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação de qualidade não encontrada com id: " + id));
    }

    public List<AvaliacaoQualidade> buscarPorEscola(Long escolaId) {
        return avaliacaoQualidadeRepository.findByEscolaId(escolaId);
    }

    public AvaliacaoQualidade salvar(Long escolaId, AvaliacaoQualidade avaliacao) {
        // Busca a escola real e completa do banco
        Escola escola = escolaService.buscarPorId(escolaId);
        // Vincula a entidade gerenciada pelo JPA à avaliação
        avaliacao.setEscola(escola);
        return avaliacaoQualidadeRepository.save(avaliacao);
    }


    public AvaliacaoQualidade atualizar(Long id, AvaliacaoQualidade dados) {
        AvaliacaoQualidade avaliacao = buscarPorId(id);
        avaliacao.setNota(dados.getNota());
        avaliacao.setComentario(dados.getComentario());
        avaliacao.setDataAvaliacao(dados.getDataAvaliacao());
        return avaliacaoQualidadeRepository.save(avaliacao);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        avaliacaoQualidadeRepository.deleteById(id);
    }
}

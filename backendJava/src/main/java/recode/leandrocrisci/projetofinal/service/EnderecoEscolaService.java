package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.EnderecoEscola;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.repository.EnderecoEscolaRepository;

import java.util.List;

@Service
public class EnderecoEscolaService {

    private final EnderecoEscolaRepository enderecoEscolaRepository;
    private final EscolaService escolaService;

    public EnderecoEscolaService(EnderecoEscolaRepository enderecoEscolaRepository,
                                  EscolaService escolaService) {
        this.enderecoEscolaRepository = enderecoEscolaRepository;
        this.escolaService = escolaService;
    }

    public List<EnderecoEscola> listarTodos() {
        return enderecoEscolaRepository.findAll();
    }

    public EnderecoEscola buscarPorId(Long id) {
        return enderecoEscolaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado com id: " + id));
    }

    // ATUALIZADO: Retorna um único endereço devido à mudança para relacionamento @OneToOne
    public EnderecoEscola buscarPorEscola(Long escolaId) {
        return enderecoEscolaRepository.findByEscolaId(escolaId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado para a escola com id: " + escolaId));
    }

    public EnderecoEscola salvar(Long escolaId, EnderecoEscola endereco) {
        Escola escola = escolaService.buscarPorId(escolaId);
        endereco.setEscola(escola);
        return enderecoEscolaRepository.save(endereco);
    }

    // ATUALIZADO: Mapeamento dos novos atributos de geoprocessamento espacial
    public EnderecoEscola atualizar(Long id, EnderecoEscola dados) {
        EnderecoEscola endereco = buscarPorId(id);
        
        endereco.setLogradouro(dados.getLogradouro());
        endereco.setNumero(dados.getNumero());
        endereco.setBairro(dados.getBairro());
        endereco.setCidade(dados.getCidade());
        endereco.setEstado(dados.getEstado());
        endereco.setCep(dados.getCep());
        
        // Novos campos espaciais integrados ao formulário do React
        endereco.setTipoLocalizacao(dados.getTipoLocalizacao());
        endereco.setLatitude(dados.getLatitude());
        endereco.setLongitude(dados.getLongitude());
        endereco.setFormattedAddress(dados.getFormattedAddress());
        
        return enderecoEscolaRepository.save(endereco);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        enderecoEscolaRepository.deleteById(id);
    }
}

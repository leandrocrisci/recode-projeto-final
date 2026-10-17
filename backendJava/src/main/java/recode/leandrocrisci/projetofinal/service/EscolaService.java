package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.repository.EscolaRepository;

import java.util.List;

@Service
public class EscolaService {

    private final EscolaRepository escolaRepository;

    public EscolaService(EscolaRepository escolaRepository) {
        this.escolaRepository = escolaRepository;
    }

    public List<Escola> listarTodas() {
        return escolaRepository.findAll();
    }

    public Escola buscarPorId(Long id) {
        return escolaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Escola não encontrada com id: " + id));
    }

    public List<Escola> buscarPorNome(String nome) {
        return escolaRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Escola> buscarPorTipo(String tipo) {
        return escolaRepository.findByTipo(tipo);
    }

    public Escola salvar(Escola escola) {
        return escolaRepository.save(escola);
    }

    public Escola atualizar(Long id, Escola dados) {
        Escola escola = buscarPorId(id);
        escola.setNome(dados.getNome());
        escola.setTipo(dados.getTipo());
        escola.setTelefone(dados.getTelefone());
        escola.setEmail(dados.getEmail());
        return escolaRepository.save(escola);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        escolaRepository.deleteById(id);
    }
}

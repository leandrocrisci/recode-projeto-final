package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.repository.ProfessorRepository;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final EscolaService escolaService;

    public ProfessorService(ProfessorRepository professorRepository,
                            EscolaService escolaService) {
        this.professorRepository = professorRepository;
        this.escolaService = escolaService;
    }

    public List<Professor> listarTodos() {
        return professorRepository.findAll();
    }

    public Professor buscarPorId(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com id: " + id));
    }

    public List<Professor> buscarPorNome(String nome) {
        return professorRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Professor> buscarPorEscola(Long escolaId) {
        return professorRepository.findByEscolaId(escolaId);
    }

    public Professor salvar(Long escolaId, Professor professor) {
        Escola escola = escolaService.buscarPorId(escolaId);
        professor.setEscola(escola);
        return professorRepository.save(professor);
    }

    public Professor atualizar(Long id, Professor dados) {
        Professor professor = buscarPorId(id);
        professor.setNome(dados.getNome());
        professor.setEmail(dados.getEmail());
        professor.setTelefone(dados.getTelefone());
        professor.setEspecialidade(dados.getEspecialidade());
        professor.setBiografia(dados.getBiografia());
        if (dados.getEscola() != null && dados.getEscola().getId() != null) {
            Escola escola = escolaService.buscarPorId(dados.getEscola().getId());
            professor.setEscola(escola);
        }
        return professorRepository.save(professor);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        professorRepository.deleteById(id);
    }
}

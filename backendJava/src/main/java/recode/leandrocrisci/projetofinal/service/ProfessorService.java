package recode.leandrocrisci.projetofinal.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.repository.ProfessorRepository;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final EscolaService escolaService;
    private final PasswordEncoder passwordEncoder;

    public ProfessorService(ProfessorRepository professorRepository,
                            EscolaService escolaService,
                            PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.escolaService = escolaService;
        this.passwordEncoder = passwordEncoder;
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
        professor.setId(null);
        professor.setEscola(escola);
        aplicarSenha(professor, professor.getSenha());
        professor.setSenha(null);
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
        aplicarSenha(professor, dados.getSenha());
        return professorRepository.save(professor);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        professorRepository.deleteById(id);
    }

    /** Campo senha em branco na edição mantém o hash atual. */
    private void aplicarSenha(Professor professor, String senha) {
        if (senha != null && !senha.isBlank()) {
            professor.setSenhaHash(passwordEncoder.encode(senha));
        }
    }
}

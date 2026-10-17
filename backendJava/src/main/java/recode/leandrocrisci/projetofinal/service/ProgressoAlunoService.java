package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Aluno;
import recode.leandrocrisci.projetofinal.model.Curso;
import recode.leandrocrisci.projetofinal.model.ProgressoAluno;
import recode.leandrocrisci.projetofinal.repository.ProgressoAlunoRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressoAlunoService {

    private final ProgressoAlunoRepository progressoRepository;
    private final AlunoService alunoService;
    private final CursoService cursoService;

    public ProgressoAlunoService(ProgressoAlunoRepository progressoRepository,
                                 AlunoService alunoService,
                                 CursoService cursoService) {
        this.progressoRepository = progressoRepository;
        this.alunoService = alunoService;
        this.cursoService = cursoService;
    }

    public List<ProgressoAluno> listarTodos() {
        return progressoRepository.findAll();
    }

    public ProgressoAluno buscarPorId(Long id) {
        return progressoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progresso não encontrado com id: " + id));
    }

    public List<ProgressoAluno> buscarPorAluno(Long alunoId) {
        return progressoRepository.findByAlunoId(alunoId);
    }

    public List<ProgressoAluno> buscarPorCurso(Long cursoId) {
        return progressoRepository.findByCursoId(cursoId);
    }

    public ProgressoAluno salvar(Long alunoId, Long cursoId, ProgressoAluno progresso) {
        Aluno aluno = alunoService.buscarPorId(alunoId);
        Curso curso = cursoService.buscarPorId(cursoId);
        progresso.setAluno(aluno);
        progresso.setCurso(curso);
        progresso.setDataAtualizacao(LocalDateTime.now());
        return progressoRepository.save(progresso);
    }

    public ProgressoAluno atualizar(Long id, ProgressoAluno dados) {
        ProgressoAluno progresso = buscarPorId(id);
        progresso.setPercentualConclusao(dados.getPercentualConclusao());
        progresso.setDataAtualizacao(LocalDateTime.now());
        return progressoRepository.save(progresso);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        progressoRepository.deleteById(id);
    }
}

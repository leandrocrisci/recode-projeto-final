package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Aluno;
import recode.leandrocrisci.projetofinal.model.Curso;
import recode.leandrocrisci.projetofinal.model.Matricula;
import recode.leandrocrisci.projetofinal.repository.MatriculaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final AlunoService alunoService;
    private final CursoService cursoService;

    public MatriculaService(MatriculaRepository matriculaRepository,
                            AlunoService alunoService,
                            CursoService cursoService) {
        this.matriculaRepository = matriculaRepository;
        this.alunoService = alunoService;
        this.cursoService = cursoService;
    }

    public List<Matricula> listarTodas() {
        return matriculaRepository.findAll();
    }

    public Matricula buscarPorId(Long id) {
        return matriculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrícula não encontrada com id: " + id));
    }

    public List<Matricula> buscarPorAluno(Long alunoId) {
        return matriculaRepository.findByAlunoId(alunoId);
    }

    public List<Matricula> buscarPorCurso(Long cursoId) {
        return matriculaRepository.findByCursoId(cursoId);
    }

    public List<Matricula> buscarPorStatus(Matricula.StatusPagamento status) {
        return matriculaRepository.findByStatusPagamento(status);
    }

    public Matricula salvar(Long alunoId, Long cursoId, Matricula matricula) {
        Aluno aluno = alunoService.buscarPorId(alunoId);
        Curso curso = cursoService.buscarPorId(cursoId);
        matricula.setAluno(aluno);
        matricula.setCurso(curso);
        if (matricula.getDataMatricula() == null) {
            matricula.setDataMatricula(LocalDateTime.now());
        }
        return matriculaRepository.save(matricula);
    }

    public Matricula atualizar(Long id, Matricula dados) {
        Matricula matricula = buscarPorId(id);
        matricula.setValorPago(dados.getValorPago());
        matricula.setStatusPagamento(dados.getStatusPagamento());
        return matriculaRepository.save(matricula);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        matriculaRepository.deleteById(id);
    }
}

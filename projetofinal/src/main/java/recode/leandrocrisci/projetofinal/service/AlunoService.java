package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Aluno;
import recode.leandrocrisci.projetofinal.model.Curso;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.repository.AlunoRepository;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final CursoService cursoService;
    private final EscolaService escolaService;

    public AlunoService(AlunoRepository alunoRepository,
                        CursoService cursoService,
                        EscolaService escolaService) {
        this.alunoRepository = alunoRepository;
        this.cursoService = cursoService;
        this.escolaService = escolaService;
    }

    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    public Aluno buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com id: " + id));
    }

    // ATUALIZADO: Substituído busca por Nome para busca por Área Residencial (urbana/rural)
    public List<Aluno> buscarPorArea(Aluno.AreaResidencial area) {
       return alunoRepository.findByArea(area);
   }

    public List<Aluno> buscarPorCurso(Long cursoId) {
        return alunoRepository.findByCursoId(cursoId);
    }

    public List<Aluno> buscarPorEscola(Long escolaId) {
        return alunoRepository.findByEscolaId(escolaId);
    }

    public Aluno salvar(Aluno aluno) {
        if (aluno.getCurso() != null && aluno.getCurso().getId() != null) {
            Curso curso = cursoService.buscarPorId(aluno.getCurso().getId());
            aluno.setCurso(curso);
        }
        if (aluno.getEscola() != null && aluno.getEscola().getId() != null) {
            Escola escola = escolaService.buscarPorId(aluno.getEscola().getId());
            aluno.setEscola(escola);
        }
        return alunoRepository.save(aluno);
    }

    // ATUALIZADO: Removidos campos antigos e mapeados os novos campos espaciais e socioespaciais
    public Aluno atualizar(Long id, Aluno dados) {
        Aluno aluno = buscarPorId(id);
        
        aluno.setArea(dados.getArea());
        aluno.setDistanciaEscola(dados.getDistanciaEscola());
        aluno.setTipoTransporte(dados.getTipoTransporte());
        aluno.setTempoDeslocamentoMinutos(dados.getTempoDeslocamentoMinutos());
        
        if (dados.getCurso() != null && dados.getCurso().getId() != null) {
            aluno.setCurso(cursoService.buscarPorId(dados.getCurso().getId()));
        }
        if (dados.getEscola() != null && dados.getEscola().getId() != null) {
            aluno.setEscola(escolaService.buscarPorId(dados.getEscola().getId()));
        }
        return alunoRepository.save(aluno);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        alunoRepository.deleteById(id);
    }
}

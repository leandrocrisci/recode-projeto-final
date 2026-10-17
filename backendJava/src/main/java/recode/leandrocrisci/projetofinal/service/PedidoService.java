package recode.leandrocrisci.projetofinal.service;

import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Escola;
import recode.leandrocrisci.projetofinal.model.Pedido;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.model.Produto;
import recode.leandrocrisci.projetofinal.repository.PedidoRepository;
import recode.leandrocrisci.projetofinal.repository.ProdutoRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final EscolaService escolaService;
    private final ProdutoRepository produtoRepository;
    private final ProfessorService professorService;

    public PedidoService(PedidoRepository pedidoRepository,
                         EscolaService escolaService,
                         ProdutoRepository produtoRepository,
                         ProfessorService professorService) {
        this.pedidoRepository = pedidoRepository;
        this.escolaService = escolaService;
        this.produtoRepository = produtoRepository;
        this.professorService = professorService;
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com id: " + id));
    }

    public List<Pedido> buscarPorEscola(Long escolaId) {
        return pedidoRepository.findByEscolaId(escolaId);
    }

    public List<Pedido> buscarPorStatus(Pedido.StatusPedido status) {
        return pedidoRepository.findByStatusPedido(status);
    }

    public List<Pedido> buscarPorProfessor(Long professorId) {
        return pedidoRepository.findByProfessorId(professorId);
    }

    public Pedido salvar(Long escolaId, Long produtoId, Long professorId, Pedido pedido) {
        Escola escola = escolaService.buscarPorId(escolaId);
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + produtoId));
        Professor professor = professorService.buscarPorId(professorId);
        pedido.setEscola(escola);
        pedido.setProduto(produto);
        pedido.setProfessor(professor);
        if (pedido.getDataPedido() == null) {
            pedido.setDataPedido(LocalDateTime.now());
        }
        return pedidoRepository.save(pedido);
    }

    public Pedido atualizar(Long id, Pedido dados) {
        Pedido pedido = buscarPorId(id);
        pedido.setQuantidade(dados.getQuantidade());
        pedido.setValorUnitario(dados.getValorUnitario());
        pedido.setStatusPedido(dados.getStatusPedido());
        return pedidoRepository.save(pedido);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        pedidoRepository.deleteById(id);
    }
}

package recode.leandrocrisci.projetofinal.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.repository.ProfessorRepository;

@Component
public class AdminInicialRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInicialRunner.class);

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String senha;
    private final String nome;

    public AdminInicialRunner(
            ProfessorRepository professorRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.senha:}") String senha,
            @Value("${app.admin.nome:Administrador}") String nome) {
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.senha = senha;
        this.nome = nome;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (email.isBlank() && senha.isBlank()) {
            return;
        }
        if (email.isBlank() || senha.isBlank()) {
            throw new IllegalStateException("ADMIN_EMAIL e ADMIN_SENHA devem ser definidos juntos.");
        }
        if (senha.length() < 8 || senha.length() > 72) {
            throw new IllegalStateException("ADMIN_SENHA deve ter entre 8 e 72 caracteres.");
        }

        String normalizedEmail = email.trim();
        if (professorRepository.findFirstByEmailIgnoreCaseAndSenhaHashIsNotNull(normalizedEmail).isPresent()) {
            return;
        }

        Professor professor = professorRepository.findFirstByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> {
                    Professor novo = new Professor();
                    novo.setNome(nome);
                    novo.setEmail(normalizedEmail);
                    return novo;
                });
        professor.setSenhaHash(passwordEncoder.encode(senha));
        professorRepository.save(professor);
        log.info("Administrador inicial configurado: {}", normalizedEmail);
    }
}

package recode.leandrocrisci.projetofinal.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import recode.leandrocrisci.projetofinal.dto.LoginRequest;
import recode.leandrocrisci.projetofinal.dto.LoginResponse;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.repository.ProfessorRepository;
import recode.leandrocrisci.projetofinal.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            ProfessorRepository professorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.professorRepository = professorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        var professor = professorRepository
                .findFirstByEmailIgnoreCaseAndSenhaHashIsNotNull(request.email().trim());
        if (professor.isEmpty()
                || !passwordEncoder.matches(request.senha(), professor.get().getSenhaHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "E-mail ou senha inválidos"));
        }

        Professor authenticatedProfessor = professor.get();
        return ResponseEntity.ok(new LoginResponse(
                jwtService.gerarToken(authenticatedProfessor),
                "Bearer",
                jwtService.getExpiracaoMinutos() * 60,
                authenticatedProfessor.getId(),
                authenticatedProfessor.getNome(),
                authenticatedProfessor.getEmail(),
                "ADMIN"));
    }
}

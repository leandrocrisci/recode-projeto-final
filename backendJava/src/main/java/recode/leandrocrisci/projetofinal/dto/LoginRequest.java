package recode.leandrocrisci.projetofinal.dto;

import jakarta.validation.constraints.NotBlank;

/** Corpo de POST /api/auth/login. A senha nunca deve ser logada. */
public record LoginRequest(
        @NotBlank(message = "E-mail é obrigatório") String email,
        @NotBlank(message = "Senha é obrigatória") String senha) {
}

package recode.leandrocrisci.projetofinal.dto;

/** Token JWS compacto (HS256) e dados do professor autenticado. */
public record LoginResponse(
        String token,
        String tipo,
        long expiraEmSegundos,
        Long id,
        String nome,
        String email,
        String role) {
}

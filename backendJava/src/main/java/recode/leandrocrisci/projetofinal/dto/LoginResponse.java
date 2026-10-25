package recode.leandrocrisci.projetofinal.dto;

public record LoginResponse(
        String token,
        String tipo,
        long expiraEmSegundos,
        Long id,
        String nome,
        String email,
        String role) {
}

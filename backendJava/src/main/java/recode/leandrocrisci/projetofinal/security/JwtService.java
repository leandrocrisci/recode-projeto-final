package recode.leandrocrisci.projetofinal.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import recode.leandrocrisci.projetofinal.model.Professor;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMinutes;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes:120}") long expirationMinutes) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET precisa ter pelo menos 32 bytes.");
        }
        if (expirationMinutes <= 0) {
            throw new IllegalStateException("JWT_EXPIRATION_MINUTES precisa ser maior que zero.");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMinutes = expirationMinutes;
    }

    public String gerarToken(Professor professor) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(professor.getId()))
                .claim("email", professor.getEmail())
                .claim("nome", professor.getNome())
                .claim("role", "ADMIN")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpiracaoMinutos() {
        return expirationMinutes;
    }
}

package recode.leandrocrisci.projetofinal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AvaliacaoCursoRequest(
    @NotNull(message = "Nota é obrigatória")
    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 10, message = "Nota máxima é 10")
    Double nota,

    String observacao,
    LocalDate dataAvaliacao
) {}

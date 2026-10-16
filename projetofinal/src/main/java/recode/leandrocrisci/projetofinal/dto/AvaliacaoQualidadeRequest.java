package recode.leandrocrisci.projetofinal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AvaliacaoQualidadeRequest(
    @NotNull(message = "Nota é obrigatória")
    @Min(value = 1, message = "Nota mínima é 1")
    @Max(value = 5, message = "Nota máxima é 5")
    Integer nota,

    String comentario,
    LocalDate dataAvaliacao
) {}

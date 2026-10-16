package recode.leandrocrisci.projetofinal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "enderecosescolas")
public class EnderecoEscola {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Logradouro é obrigatório")
    @Column(nullable = false)
    private String logradouro;

    @Column
    private String numero;

    @Column
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(nullable = false)
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Column(nullable = false, length = 2)
    private String estado;

    @Column(length = 9, columnDefinition = "VARCHAR(9) DEFAULT NULL")
    private String cep;

    // ADICIONADO: Tipo de localização da escola mapeado como ENUM string
    @NotNull(message = "Tipo de localização (urbana/rural) é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_localizacao", columnDefinition = "ENUM('urbana', 'rural')", nullable = false)
    private TipoLocalizacao tipoLocalizacao = TipoLocalizacao.urbana;

    // ADICIONADO: Coordenada de Latitude com precisão decimal ideal para o Google Maps
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    // ADICIONADO: Coordenada de Longitude com precisão decimal ideal para o Google Maps
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    // ADICIONADO: Endereço completo formatado retornado pela API de Geocoding
    @Column(name = "formatted_address", length = 500)
    private String formattedAddress;

    // ATUALIZADO: Modificado para @OneToOne (Uma escola possui apenas um endereço)
    @OneToOne
    @JoinColumn(name = "escolaid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "endereco"})
    private Escola escola;

    // Enum auxiliar declarado como subclasse para centralização de código
    public enum TipoLocalizacao {
        urbana, rural
    }

    public EnderecoEscola() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public TipoLocalizacao getTipoLocalizacao() { return tipoLocalizacao; }
    public void setTipoLocalizacao(TipoLocalizacao tipoLocalizacao) { this.tipoLocalizacao = tipoLocalizacao; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getFormattedAddress() { return formattedAddress; }
    public void setFormattedAddress(String formattedAddress) { this.formattedAddress = formattedAddress; }

    public Escola getEscola() { return escola; }
    public void setEscola(Escola escola) { this.escola = escola; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EnderecoEscola e)) return false;
        return Objects.equals(id, e.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

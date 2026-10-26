package recode.leandrocrisci.projetofinal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@SpringBootApplication
public class ProjetofinalApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjetofinalApplication.class, args);
	}

	/** Origens do frontend (local e Render). Lista em CORS_ALLOWED_ORIGINS. */
	@Bean
	public WebMvcConfigurer corsConfigurer(
			@Value("${app.cors.allowed-origins:http://localhost:5174,https://frontendweb-rcs5.onrender.com}") String allowedOrigins) {
		String[] origins = Arrays.stream(allowedOrigins.split(","))
				.map(String::trim)
				.map(origin -> origin.replaceAll("/+$", ""))
				.filter(origin -> !origin.isEmpty())
				.toArray(String[]::new);

		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins(origins)
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}

}

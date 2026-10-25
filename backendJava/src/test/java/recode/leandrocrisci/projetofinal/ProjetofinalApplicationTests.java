package recode.leandrocrisci.projetofinal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import recode.leandrocrisci.projetofinal.model.Professor;
import recode.leandrocrisci.projetofinal.repository.ProfessorRepository;
import recode.leandrocrisci.projetofinal.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjetofinalApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private ProfessorRepository professorRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void contextLoads() {
	}

	@Test
	void corsAllowsDeployedFrontend() throws Exception {
		mockMvc.perform(options("/api/escolas")
						.header("Origin", "https://frontendweb-rcs5.onrender.com")
						.header("Access-Control-Request-Method", "GET"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin",
						"https://frontendweb-rcs5.onrender.com"));
	}

	@Test
	void readsRemainPublic() throws Exception {
		mockMvc.perform(get("/api/escolas"))
				.andExpect(status().isOk());
	}

	@Test
	void allWriteOperationsRequireAuthenticationIncludingOrderCreation() throws Exception {
		mockMvc.perform(post("/api/escolas")
						.contentType(APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(put("/api/escolas/1")
						.contentType(APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(delete("/api/escolas/1"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(post("/api/pedidos/escola/1/produto/1/professor/1")
						.contentType(APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(post("/api/escolas")
						.header(AUTHORIZATION, "Bearer invalid-token")
						.contentType(APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void validProfessorTokenPassesAuthorizationForWrites() throws Exception {
		Professor professor = new Professor();
		professor.setId(10L);
		professor.setEmail("professor@example.test");
		professor.setNome("Professor");
		String token = jwtService.gerarToken(professor);

		mockMvc.perform(post("/api/escolas")
						.header(AUTHORIZATION, "Bearer " + token)
						.contentType(APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void professorWithPasswordCanLoginWithoutExposingCredentials() throws Exception {
		Professor professor = new Professor();
		professor.setNome("Professor de Teste");
		professor.setEmail("professor-login@example.test");
		professor.setSenhaHash(passwordEncoder.encode("senha-segura-123"));
		Professor savedProfessor = professorRepository.save(professor);

		mockMvc.perform(post("/api/auth/login")
						.contentType(APPLICATION_JSON)
						.content("""
								{"email":"professor-login@example.test","senha":"senha-segura-123"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.role").value("ADMIN"));

		mockMvc.perform(get("/api/professores/{id}", savedProfessor.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.senha").doesNotExist())
				.andExpect(jsonPath("$.senhaHash").doesNotExist());
	}
}

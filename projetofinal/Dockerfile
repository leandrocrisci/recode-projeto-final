# Etapa 1: Build da aplicação com Maven e Java 21
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# COPIA tudo do repositório para dentro do container
COPY . .

# ENTRA explicitamente na pasta do backend antes de rodar o Maven
WORKDIR /app/projetofinal
RUN mvn clean package -DskipTests

# Etapa 2: Execução da aplicação
FROM eclipse-temurin:21-jre
WORKDIR /app

# Busca o arquivo .jar gerado dentro da pasta target do backend
COPY --from=build /app/projetofinal/target/*.jar app.jar
EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]

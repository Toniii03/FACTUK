# Usar una imagen base con OpenJDK 21
FROM openjdk:21-jdk-slim as builder

# Instalar Maven
RUN apt-get update && apt-get install -y maven

# Definir el directorio de trabajo
WORKDIR /app

# Copiar el archivo pom.xml (y otros archivos necesarios) al contenedor
COPY pom.xml .

# Descargar las dependencias de Maven (sin construir el proyecto todavía)
RUN mvn dependency:go-offline

# Copiar el código fuente del proyecto
COPY src /app/src

# Construir el proyecto usando Maven
RUN mvn clean package

# Crear una segunda etapa para la imagen final (sin Maven)
FROM openjdk:21-jdk-slim

# Establecer el directorio de trabajo en la segunda etapa
WORKDIR /app

# Copiar el archivo JAR generado desde la etapa de construcción
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto 8080
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]

# Usar una imagen base con Maven y OpenJDK
FROM maven:3.8.6-openjdk-17-slim as builder

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el código fuente del proyecto al contenedor
COPY . .

# Ejecutar Maven para compilar el proyecto y generar el JAR
RUN mvn clean package -DskipTests

# Usar una imagen base con OpenJDK para la aplicación
FROM openjdk:17-jdk-slim

# Definir el directorio de trabajo para la aplicación
WORKDIR /app

# Copiar el JAR desde la etapa anterior
COPY --from=builder /app/target/*.jar factur-0.0.1-SNAPSHOT.jar

# Exponer el puerto en el que la aplicación va a funcionar
EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]

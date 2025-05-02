# Usar una imagen base con OpenJDK 21 y Maven
FROM maven:3.8.6-openjdk-21-slim as builder

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo pom.xml y las carpetas necesarias al contenedor
COPY pom.xml /app/

# Copiar todo el código fuente al contenedor (se copiará después del pom.xml para aprovechar la caché)
COPY src /app/src/

# Ejecutar Maven para compilar el proyecto
RUN mvn clean package -DskipTests

# Usar una imagen base de OpenJDK para ejecutar la aplicación
FROM openjdk:21-jdk-slim

# Copiar el archivo .jar generado por Maven desde la etapa de construcción
COPY --from=builder /app/target/*.jar /app/app.jar

# Definir el comando de inicio para la aplicación
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# Exponer el puerto (ajústalo si es necesario)
EXPOSE 8080
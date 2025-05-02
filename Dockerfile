# Usa una imagen base de OpenJDK
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo JAR (el nombre del archivo puede variar)
COPY target/*.jar factur-0.0.1-SNAPSHOT.jar

# Expone el puerto en el que la aplicación va a funcionar
EXPOSE 8080

# Comando para ejecutar el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]

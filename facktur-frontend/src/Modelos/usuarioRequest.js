class usuarioReques{
    constructor(nombreUsuario, nombre, email, contrasena, tipo) {
        this.nombreUsuario = nombreUsuario;
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
        this.tipo = tipo;
      }

    toJSON() {
        return {
          nombreUsuario: this.nombreUsuario,
          nombre: this.nombre,
          email: this.email,
          contrasena: this.contrasena,
          tipo: this.tipo
        };
      }
}
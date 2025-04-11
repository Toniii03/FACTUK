class usuarioRequest{
    constructor(nombreUsuario, nombre, email, contrasena1, tipo) {
        this.nombreUsuario = nombreUsuario;
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena1;
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

      toString() {
        return `UsuarioRequest { nombreUsuario: ${this.nombreUsuario}, nombre: ${this.nombre}, email: ${this.email}, contrasena: ${this.contrasena}, tipo: ${this.tipo} }`;
      }
}

export { usuarioRequest };
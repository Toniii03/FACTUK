package org.facktur.factur.repositorios;

import org.facktur.factur.entidades.PasswordResetToken;
import org.facktur.factur.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

	PasswordResetToken save(PasswordResetToken resetToken);

	PasswordResetToken findByToken(String token);

	void delete(PasswordResetToken resetToken);

	PasswordResetToken findByUsuario(Usuario usuario);
}

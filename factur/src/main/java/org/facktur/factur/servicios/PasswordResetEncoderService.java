package org.facktur.factur.servicios;

import java.time.LocalDateTime;
import java.util.UUID;

import org.facktur.factur.entidades.PasswordResetToken;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.PasswordResetTokenRepository;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetEncoderService {

	@Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
	
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UsuarioRepositorio usuarioRepository;

    public String createPasswordResetToken(Usuario usuario) {
        String token = UUID.randomUUID().toString();
        
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUsuario(usuario);
        
        if (existingToken != null) {
            existingToken.setToken(token);
            existingToken.setExpiryDate(LocalDateTime.now().plusHours(1));
            passwordResetTokenRepository.save(existingToken);
        } else {
            PasswordResetToken newToken = new PasswordResetToken();
            newToken.setToken(token);
            newToken.setUsuario(usuario);
            newToken.setExpiryDate(LocalDateTime.now().plusHours(1));
            passwordResetTokenRepository.save(newToken);
        }

        return token;
    }

    
    public void sendPasswordResetEmail(String toEmail, String token) {
    	String link = "http://localhost:3000/forgot-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Recuperación de contraseña");
        message.setText("Haz clic en el siguiente enlace para restablecer tu contraseña:\n" + link);

        mailSender.send(message);
    }
	
}

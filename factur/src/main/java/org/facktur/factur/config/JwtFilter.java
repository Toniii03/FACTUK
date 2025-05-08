package org.facktur.factur.config;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException, java.io.IOException {
        // Obtener el token desde la solicitud HTTP
        String token = jwtUtil.getTokenFromRequest(request);

        if (token != null && jwtUtil.validateToken(token)) {
            // Si el token es válido, obtenemos el nombre de usuario del token
            String username = jwtUtil.getUsernameFromToken(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Aquí deberías cargar los detalles del usuario (por ejemplo, desde la base de datos o un servicio)
                // Suponiendo que tengas un servicio UserDetailsService configurado, podrías usarlo para obtener el UserDetails
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(username, null, null);  // Aquí puedes agregar los roles si tienes roles

                // Establecer la autenticación en el contexto de seguridad de Spring
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}

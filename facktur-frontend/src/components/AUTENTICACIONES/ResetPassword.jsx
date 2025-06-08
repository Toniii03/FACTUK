import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export const ResetPassword = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = new URLSearchParams(window.location.search).get("token");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .required('La contraseña es obligatoria'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
        .required('Confirmar contraseña es obligatorio'),
    }),
    onSubmit: async (values) => {
      try {
        const url = `${API_URL}auth/reset-password`;
        const response = await axios.post(url, {
          token,
          newPassword: values.password,
        });
        setSuccess(true);
        setError("");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || 'Error al restablecer la contraseña';
          setError(message);
        } else {
          setError('Error desconocido al restablecer la contraseña');
        }
      }
    },
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff9f0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px 35px',
        borderRadius: '12px',
        boxShadow: '0 15px 40px rgba(250, 196, 99, 0.25)',
        width: '100%',
        maxWidth: '420px',
        color: '#333',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '25px',
          textAlign: 'center',
          color: '#333', // secundario
        }}>
          Restablecer Contraseña
        </h2>

        {success ? (
          <div style={{
            color: '#FAC463',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: '16px',
          }}>
            Contraseña restablecida correctamente. Ahora puedes iniciar sesión.
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="password" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', display: 'block', color: '#555' }}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Introduce tu nueva contraseña"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1.8px solid #ccc',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  color: '#333',
                }}
                {...formik.getFieldProps('password')}
                onFocus={e => e.target.style.borderColor = '#FAC463'}
                onBlur={e => e.target.style.borderColor = formik.errors.password && formik.touched.password ? '#e53e3e' : '#ccc'}
              />
              {formik.touched.password && formik.errors.password && (
                <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '6px' }}>
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', display: 'block', color: '#555' }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Repite tu nueva contraseña"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  borderRadius: '8px',
                  border: '1.8px solid #ccc',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  color: '#333',
                }}
                {...formik.getFieldProps('confirmPassword')}
                onFocus={e => e.target.style.borderColor = '#FAC463'}
                onBlur={e => e.target.style.borderColor = formik.errors.confirmPassword && formik.touched.confirmPassword ? '#e53e3e' : '#ccc'}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '6px' }}>
                  {formik.errors.confirmPassword}
                </p>
              )}
            </div>

            {error && (
              <div style={{
                color: '#b91c1c',
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
                marginTop: '-10px',
                marginBottom: '10px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                backgroundColor: '#FAC463',
                color: '#333',
                fontWeight: '700',
                fontSize: '16px',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(250, 196, 99, 0.6)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#e4ac3e';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(228, 172, 62, 0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#FAC463';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(250, 196, 99, 0.6)';
              }}
            >
              Restablecer Contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import "../../styles/menu/StyleMenu.css";
import logo from "../../logo.png";
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TiThMenu } from "react-icons/ti";

import ServicioUsuarios from '../SERVICIOS/ServicioUsuarios';

export const Menu = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [tipoUsuario, setTipoUsuario] = useState("NOR");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isLoggedIn, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeModal = () => setShowConfirmModal(false);
    const openModal = () => setShowConfirmModal(true);

    const confirmLogout = async () => {
        closeModal();
        try {
            const result = await ServicioUsuarios.logout();
            if (result.status === 'ok') {
                localStorage.clear();
                Cookies.remove('user');
                setIsAuthenticated(false);
                setLoading(true);
                navigate("/auth/login", { replace: true });
            }
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const url = `${API_URL}auth/check`;
                const response = await axios.get(url, {
                    withCredentials: true
                });
                setIsAuthenticated(response.status === 200);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [API_URL]);

    useEffect(() => {
        if (!loading && isLoggedIn === false) {
            navigate("/auth/login", { replace: true });
        }
    }, [isLoggedIn, loading, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isLoggedIn) {
                try {
                    const url = `${API_URL}auth/tipo-usuario`;
                    const response = await axios.get(url, {
                        withCredentials: true
                    });
                    if (response.status === 200 && response.data) {
                        setTipoUsuario(response.data.tipo || "NOR");
                    }
                } catch (error) {
                    console.error("Error al obtener datos de usuario", error);
                    setTipoUsuario("NOR");
                }
            }
        };
        fetchUserData();
    }, [isLoggedIn, API_URL]);

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <div className="mt-3 fs-5 fw-semibold text-primary">Cargando...</div>
                </div>
            </div>
        );

    return (
        <div className="menu-container">
            <div className="menu-left">
                <div className='div-menu-img'>
                    <NavLink to="/"><img id='imagen-logo' src={logo} alt="Logo" /></NavLink>
                </div>

                <div className=''>
                    <div className="menu-links">
                        {tipoUsuario === "ADM" && (
                            <div className="card-nelace-menu">
                                <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/usuarios">
                                    Gestión de usuarios
                                </NavLink>
                            </div>
                        )}
                        <div className="card-nelace-menu">
                            <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/resumen">
                                Resumen
                            </NavLink>
                        </div>
                        <div className="card-nelace-menu">
                            <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/facturas">
                                Facturas
                            </NavLink>
                        </div>
                        <div className="card-nelace-menu">
                            <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/pagos">
                                Pagos
                            </NavLink>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <div className='hamburger' onClick={toggleMenu}>
                    <TiThMenu size={50} />
                </div>
            </div>

            <div className='menu-right'>
                {isLoggedIn ? (
                    <>
                        <div className='btnLogin'><NavLink to="/">Mi cuenta</NavLink></div>
                        <div className='btnLogin'><NavLink to="#" onClick={openModal}>Salir</NavLink></div>
                    </>
                ) : (
                    <>
                        <div className='btnLogin'><NavLink to="/auth/login">Iniciar Sesión</NavLink></div>
                        <div className='btnLogin'><NavLink to="/auth/register">Registrarme</NavLink></div>
                    </>
                )}
            </div>

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>¿Estás seguro de que quieres salir?</h3>
                        <div className="modal-buttons">
                            <button className="btnConfirm" onClick={confirmLogout}>Sí, salir</button>
                            <button className="btnCancel" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

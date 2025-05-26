import React, { useEffect, useState } from 'react';
import "../../styles/menu/StyleMenu.css"
import logo from "../../logo.png"
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';



import ServicioUsuarios from '../SERVICIOS/ServicioUsuarios';


export const Menu = () => {

    const tipoUsuario = localStorage.getItem("tipo") || "NOR";
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        setShowConfirmModal(true);
    };

    const closeModal = () => {
        setShowConfirmModal(false);
    };

    const confirmLogout = async () => {
        closeModal();
        await ServicioUsuarios.logout();
        navigate("/auth/login");
    };

    const [isLoggedIn, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8080/auth/check', {
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
    }, []);

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="menu-container">
            <div className="menu-img">
                <div className='div-menu-img'>
                    <NavLink to="/"><img id='imagen-logo' src={logo} alt="Imagen de menú" /></NavLink>
                </div>

                <div className="menu-links">
                    {(() => {
                        if (tipoUsuario === "ADM") {
                            return (
                                <div className="card-nelace-menu">
                                    <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/usuarios">Gestion de usuarios</NavLink>
                                </div>
                            );
                        }
                    })()}
                    <div className="card-nelace-menu">
                        <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/resumen">Resumen</NavLink>
                    </div>
                    <div className="card-nelace-menu">
                        <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/facturas">Facturas</NavLink>
                    </div>
                    <div className="card-nelace-menu">
                        <NavLink className={({ isActive }) => isActive ? "card-nelace-menu active-link" : "card-nelace-menu"} to="/pagos">Pagos</NavLink>
                    </div>
                </div>
            </div>

            <div className='div-botones-login'>
                {isLoggedIn ? (
                    <>
                        <div className='btnLogin'><NavLink to="/">Mi cuenta</NavLink></div>
                        <div className='btnLogin'><NavLink onClick={openModal}>Salir</NavLink></div>
                    </>
                ) : (
                    <>
                        <div className='btnLogin'><NavLink to="/auth/login">Iniciar Sesion</NavLink></div>
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
    )
}

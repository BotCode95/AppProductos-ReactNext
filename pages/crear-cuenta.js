import React, {useState} from 'react'
import {css} from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario'
import firebase from '../firebase';

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INITIAL = {
    nombre: '',
    email: '',
    password: ''
}

const CrearCuenta = () => {

    const [error, setError] = useState(false);

    const { valores, errores, submitForm, handleChange, handleSubmit,handleBlur } = useValidacion(STATE_INITIAL, validarCrearCuenta, crearCuenta); //paso los parametros 3

    const {nombre, email, password} = valores;

    async function crearCuenta() {
       try {
            //utilizo firebase
        await firebase.registrar(nombre,email,password);
        Router.push('/');
       } catch (error) {
           console.log('Hubo un error al crear el usuario', error.message);
           setError(error.message);
       }
    }
    return (  
        <div>
            <Layout>
            <>
                <h1
                
                    css={css`
                        text-align:center;
                        margin-top: 5rem;
                    `}
                >Crear Cuenta</h1>
                <Formulario 
                    onSubmit={handleSubmit}
                >
                    <Campo>
                        <label htmlFor="nombre">Nombre:</label>
                        <input 
                            type="text" 
                            id="nombre"
                            placeholder="Tu Nombre"
                            name="nombre"
                            value= {nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                    </Campo>

                    {errores.nombre && <Error><p>{errores.nombre}</p></Error>}
                    <Campo>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Tu email"
                            autoComplete="off"
                            name="email"
                            value= {email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                    </Campo>
                    {errores.email && <Error><p>{errores.email}</p></Error>}
                    <Campo>
                        <label htmlFor="password">Password: </label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Tu password"
                            autoComplete="new password"
                            name="password"
                            value= {password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            />
                    </Campo>
                    {errores.password && <Error><p>{errores.password}</p></Error>}

                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                        type="submit" 
                        value="Crear Cuenta"/>
                </Formulario>
            </>
            </Layout>
        </div>
    );
}
 
export default CrearCuenta;
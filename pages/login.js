import React, {useState, useEffect} from 'react'
import {css} from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario'
import firebase from '../firebase';

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email: '',
    password: ''
}

const Login = () => {

    const [error, setError] = useState(false);

    const {valores, errores, submitForm, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

    const {email, password} = valores;

    async function iniciarSesion(){
        try {
            await firebase.login(email, password);
            Router.push('/');
        } catch (error) {
            console.log('Hubo un error al iniciar sesion', error.message);
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
            >Iniciar Sesión</h1>
            <Formulario 
                onSubmit={handleSubmit}
            >
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
                    value="Iniciar Sesión"/>
            </Formulario>
        </>
        </Layout>
    </div>
      );
}
 
export default Login;
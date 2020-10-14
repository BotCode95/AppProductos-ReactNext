import React, {useState, useContext} from 'react'
import {css} from '@emotion/core';
import Router, {useRouter } from 'next/router';
import FileUploader from "react-firebase-file-uploader";
import Layout from '../components/layout/Layout'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario'
import {FirebaseContext} from '../firebase';
import Error404 from '../components/layout/404'
//validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INITIAL = {
    nombre: '',
    empresa: '',
    // imagen: '',
    url: '',
    descripcion: ''
}

const NuevoProducto = () => {

    //state de file image
    const [nombreimagen, setNombre] = useState('');
    const [subirimagen, setSubir] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlImagen] = useState('');

    const [error, setError] = useState(false);

    const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INITIAL, validarCrearProducto, crearProducto);

    const {nombre, empresa, imagen, url, descripcion} = valores;

    //hook de routing para redireccionar
    const router = useRouter();
    //context con las crud de firebase
    const {usuario, firebase} = useContext(FirebaseContext);

    async function crearProducto() {
        //si el usuario no esta autenticado 
        if(!usuario) {
            return router.push('/login');
        }

        //crear el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        // const {urlimagen} = producto
        //insertar el producto en la bd 
        firebase.db.collection('productos').add(producto);

        return router.push('/');
    }

    const handleUploadStart = () => {
        setProgreso(0); //empieza el progreso en 0
        setSubir(true); //cambia el estado a true
    }

    const handleProgress = progreso => {
        setProgreso({
            progreso
        })
    }

    const handleUploadError = error => {
        setSubir(error)
        console.log(error)
    }

    const handleUploadSuccess = nombre => {
        setProgreso(100)
        setSubir(false)
        setNombre(nombre)
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                setUrlImagen(url);
            });
    }

    

    return ( 
        <div>
        <Layout>
        {(!usuario) ? <Error404/> : (
        <>
            <h1
                css={css`
                    text-align:center;
                    margin-top: 5rem;
                `}
            >Nuevo Producto</h1>
            <Formulario 
                onSubmit={handleSubmit}
            >
            <fieldset>
                <legend>Información General</legend>
           
                <Campo>
                    <label htmlFor="nombre">Nombre:</label>
                    <input 
                        type="text" 
                        id="nombre"
                        placeholder="Nombre del producto"
                        name="nombre"
                        value= {nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                </Campo>
                {errores.nombre && <Error><p>{errores.nombre}</p></Error>}
                <Campo>
                    <label htmlFor="empresa">Empresa:</label>
                    <input 
                        type="text" 
                        id="empresa"
                        placeholder="Nombre de empresa o compañia"
                        name="empresa"
                        value= {empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                </Campo>
                {errores.empresa && <Error><p>{errores.empresa}</p></Error>}
                <Campo>
                    <label htmlFor="imagen">Imagen:</label>
                    <FileUploader
                        accept="image/*"
                        id="imagen"
                        name="imagen"
                        randomizeFilename
                        storageRef = {firebase.storage.ref("productos")}
                        onUploadStart= {handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress= {handleProgress}
                        />
                </Campo>
                
                <Campo>
                    <label htmlFor="url">URL:</label>
                    <input 
                        type="url" 
                        id="url"
                        name="url"
                        placeholder="url de tu producto"
                        value= {url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                </Campo>
                {errores.url && <Error><p>{errores.url}</p></Error>}
                </fieldset>
                <fieldset>
                    <legend>Sobre tu Producto:</legend>
                    <Campo>
                    <label htmlFor="descripcion">Descripcion:</label>
                    <textarea 
                        id="descripcion"
                        name="descripcion"
                        value= {descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ></textarea>
                </Campo>
                {errores.descripcion && <Error><p>{errores.descripcion}</p></Error>}
                </fieldset>

                {error && <Error>{error}</Error>}
                <InputSubmit 
                    type="submit" 
                    value="Crear Producto"/>
            </Formulario>
        </>
        )}
        </Layout>
    </div>
     );
}
 
export default NuevoProducto;
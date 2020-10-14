import React, {useState,useEffect, useContext} from 'react';
import {useRouter} from 'next/router';
import {FirebaseContext} from '../../firebase';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es } from 'date-fns/locale'
import Layout from '../../components/layout/Layout'
import Error404 from '../../components/layout/404'
import {css} from '@emotion/core'
import styled from '@emotion/styled';
import {Campo, InputSubmit} from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton'

const ContenedorProducto = styled.div`
    @media (min-width: 768px){
        display:grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    //State del componente
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true); //cuando carga el componente hace la consulta
    //routing para obtener el id actual
    const router = useRouter();
    const {query: {id}} = router;

    //context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                
                if(producto.exists){
                    setProducto(producto.data());
                    setConsultarDB(false); // reset de la consulta cuando tenemos un producto
                } else {
                   setError(true);
                   setConsultarDB(false); // reset de la consulta cuando tenemos un producto
                }
            }
            obtenerProducto();
        }
        
    }, [id]);
    //con !error evito que aparezca cargando... cuando el id es equivocado
    if(Object.keys(producto).length === 0 && !error ) return 'Cargando...'

    const {comentarios, creado,creador, descripcion, empresa, url, urlimagen, votos, nombre, haVotado} = producto;

    //administrar y validar los votos
    const votarProducto = () => {
        //usuario no autenticado return to home
        if(!usuario) {
            return router.push('/login');
        }

        //obtener y sumar nuevo voto
        const nuevoTotal = votos + 1;
        
        //verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return;

        //guardar el id del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];
        //actualizar en la base de datos
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal, haVotado: nuevoHaVotado
        })

        //actualizar en el state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })

        setConsultarDB(true); //si hay un voto consulta la bd 
    }

    //creacion de comentarios
    const comentarioChange = (e) => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    //Identifica si el comentario es del creador del producto
    const esCreador = (id) => {
        if(creador.id === id){
            return true;
        }
    }

    const agregarComentario = (e) => {
        e.preventDefault();

        if(!usuario){
            return router.push('/login');
        }

        //informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre= usuario.displayName;

        //...spread comentario y agregarlo al arreglo
        //spread comment's and them to add array
        const nuevosComentarios = [...comentarios, comentario] //copia + el nuevo comentario

        //Actualizar la BD
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })
        //Actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        setConsultarDB(true); //si hay un comentario consulta la bd 
    }


    //revisar si el creador del producto es el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario){
            return false
        }

        if(creador.id === usuario.uid){
            return true;
        }
    }

    //elimina un producto
    const eliminarProducto = async() => {
        if(!usuario){
            return router.push('/login')
        }

        if(creador.id !== usuario.uid){
            return router.push('/')
        }

        
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error)
        }
    }
    return ( 
        <Layout>
        <>
            {error ? <Error404/> : (
            <div className="contenedor">
                <h1
                    css={css`
                        text-align:center;
                        margin-top: 5rem;
                    `}
                >{nombre}</h1>
                <ContenedorProducto>
                    <div>
                       <p>Publicado hace: {formatDistanceToNow( new Date(creado),{locale: es})}</p>
                       <p>Publicado por : {creador.nombre} : {empresa}</p>
                       <img src={urlimagen} />
                       <p>{descripcion}</p>

                    {usuario && (
                        <>
                        <h2>Agrega tu comentario: </h2>
                       <form 
                            onSubmit={agregarComentario}
                       >
                           <Campo>
                               <input
                                    type="text"
                                    name="mensaje"
                                    onChange={comentarioChange}
                               />
                                   
                           </Campo>
                           <InputSubmit
                                type="submit"
                                value= "Agregar comentario"
                           />
                       </form>
                        </>
                    )}

                       <h2
                            css={css`
                                margin: 2rem 0;
                            `}
                       >Comentarios</h2>
                       {comentarios.length === 0 ? "Aún no hay comentarios" : ( 
                       <ul>
                        {comentarios.map( (comentario, i) => (
                            <li
                                key={`${comentario.usuarioId}-${i}`} //como key el id del usuario + el num  de com
                                css={css`
                                    border: 1px solid #e1e1e1;
                                    padding: 2rem;
                                `}
                            >
                                <p>{comentario.mensaje}</p>
                                <p>Escrito por:
                                    <span
                                        css={css`
                                            font-weight:bold;
                                        `}
                                    > {' '}{comentario.usuarioNombre}</span>
                                </p>
                                {esCreador( comentario.usuarioId) && <CreadorProducto>Es creador</CreadorProducto> }
                            </li>
                        ))}
                        </ul>
                       )}
                    </div>
                    <aside>
                        <Boton
                            target="_blank"
                            bgColor="true"
                            href={url}
                        >Visitar URL</Boton>
                        
                       <div 
                            css={css`
                                margin-top:5rem;
                            `}
                       >
                       <p  css={css`
                                text-align: center;
                            `}
                            >{votos} Votos</p>
                        {usuario && (
                            <Boton
                                onClick={votarProducto}
                            >Votar</Boton>
                        )}
                       </div>
                    </aside>
                </ContenedorProducto>
                {puedeBorrar() && 
                    <Boton
                        onClick={eliminarProducto}
                    >Eliminar Producto</Boton>
                    }
            </div>
            )}
        </>
        </Layout>
    );
}

export default Producto;
import React, {useEffect, useState} from 'react'
import Layout from '../components/layout/Layout'
import {useRouter} from 'next/router'
import DetallesProductos from '../components/layout/DetallesProductos'
import useProductos from '../hooks/useProductos';


const Buscar = () => {

    const router = useRouter();
    // console.log(router)

    const {query: {q}} = router;
    // console.log(q);

    const {productos} = useProductos('creado');
    const [resultado, setResultado] = useState([]);
    // console.log(productos)

    useEffect(() => {
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto => {  //resultado de la busqueda
            return (
                producto.nombre.toLowerCase().includes(busqueda) || 
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        });
        setResultado(filtro);
    }, [q, productos])
    return ( 
        <div>
            <Layout>
               <div className="listado-productos">
                   <div className="contenedor">
                       <div className="bg-white">
                           {resultado.map(producto => (
                               <DetallesProductos
                                    key={producto.id}
                                    producto={producto}
                               />
                           ))}
                       </div>
                   </div>
               </div>
            </Layout>
        </div>
     );
}
 
export default Buscar;
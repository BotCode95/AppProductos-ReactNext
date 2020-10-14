import React, {useState, useEffect} from 'react'

const useValidacion = (stateInicial, validar, fn) => {

    const [valores, setValores]  = useState(stateInicial);
    const [errores, setErrores] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if(submitForm) {
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores){
                fn(); //ejecuta la funcion que pasa el usuario;
                //se utiliza tanto para crearProducto, crearCuenta o IniciarSesion
            }
            setSubmitForm(false);
        }
    }, [errores])

    //funcion que se ejecuta conforme el usuario escriba algo
    const handleChange =e => {
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }

    //funcion cuando se envia el form
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores); //la funcion validar que pasa como parametro en el custom hook
        setErrores(erroresValidacion);
        setSubmitForm(true);
    }


    //cuando se realiza el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }
    return {
        valores,
        errores,
        submitForm,
        handleChange,
        handleSubmit,
        handleBlur
    };
}
 
export default useValidacion;
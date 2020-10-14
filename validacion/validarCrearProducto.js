
export default function validarCrearProducto(valores){
    let errores= ({});

    //validar nombre del usuario
    if(!valores.nombre) {
        errores.nombre= "El nombre es obligatorio";
    }

    //validar empresa
    if(!valores.empresa) {
        errores.empresa = "Nombre de empresa es obligatorio";
    }

    if(!valores.url){
        errores.url = "La url del producto es obligatoria"
    }else if(!/^(ftp|http|https):\/\/[^"]+$/.test(valores.url)) {
        errores.url = "URL no válida"

    }

    if(!valores.descripcion){
        errores.descripcion = "Agrega una descripción de tu producto"
    }

    return errores;
}
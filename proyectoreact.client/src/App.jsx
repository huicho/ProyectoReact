import "/Content/bootstrap.min.css";
import { useEffect, useState } from "react";

const App = () => {

    const [tareas, setTareas] = useState([])
    const [descripcion, setDescripcion] = useState("")


    //metodo de mostrar las tareas
    const mostrarTareas = async () => {

        const response = await fetch("api/tarea/Lista");
        if (response.ok) {
            const data = await response.json();
            setTareas(data);
        } else {

            console.log("status code:" + response.status);
        }

    }

    //3. metodo para convertir fechas
    const formatDate = (string) => {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let fecha = new Date(string).toLocaleDateString("es-Mx", options);
        let hora = new Date(string).toLocaleTimeString();
        return fecha + "|" + hora
    }


    useEffect(() => {
        mostrarTareas();

    }, [])


    //guardar tarea
    const GuardarTarea = async(e) =>{
        e.preventDefault()

        const response = await fetch("api/tarea/Guardar", {

            method: "POST",
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({descripcion, setDescripcion})
        })

        if (response.ok) {
            setDescripcion("");
            await mostrarTareas();
        } 

    }

    //cerrar tarea
    const CerrarTarea = async (id) => {

        const response = await fetch("api/tarea/Cerrar/" + id, {
            method: "DELETE"
        })

        if (response.ok) {
            await mostrarTareas();
        }

    }


    return (
        <div className="container bg-dark p-4 vh-100">
        <h2 className="text-white">Lista de tareas</h2>
            <div className="row">
                <div className="col-sm-12">
                <form onSubmit={GuardarTarea}>

                        <div className="input-group">
                            <input type="text"
                                className="form-control"
                                placeholder="Ingrese la descripcion de la tarea"
                                value={descripcion}
                                onChange={(e)=>setDescripcion(e.target.value)}
                            />
                            <button className="btn btn-success" type="submit">Agregar</button>
                        </div>   
                    </form>
                </div>
            </div>

                <div className="row mt-4">
                    <div className="col-sm-12">

                        <div className="list-group">
                            {
                                tareas.map(
                                    (item) => (
                                        <div key={item.idTarea} className="list-group-item list-group-item-action" >
                                            <h5 className="text-primary"> {item.descripcion}</h5>
                                            <div class="d-flex justify-content-between">
                                                <small className="text-muted">{formatDate(item.fechaRegistro)}</small>
                                                <button onClick={ ()=>CerrarTarea(item.idTarea)} className="btn btn-sm btn-outline-danger">Cerrar</button>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
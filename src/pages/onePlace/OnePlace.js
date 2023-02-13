import './OnePlace.css'
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SliderImages from '../../components/sliderImages/SliderImages';
import Button from 'react-bootstrap/Button';
import Map from '../../components/map/Map';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL_2 } from "../../API";


export default function OnePlace({ placeId }) {
    const baseUrl = API_BASE_URL_2+'place/';


    const toastId2 = React.useRef(null);

    const [data, setData] = useState(null);



    const notify = () => toastId2.current = toast("Guardando", { autoClose: false });
    const update = () => toast.update(toastId2.current, { render: "Cambios guardados", type: toast.TYPE.INFO, autoClose: 2000 });


    const [isRevisar, setIsRevisar] = useState(false);
    const [isAceptado, setIsAceptado] = useState(false);
    const [isRechazado, setIsRechazado] = useState(false);
    const [isArchivado, setIsArchivado] = useState(false);
    let location = {}

    useEffect(() => {
        if (data === null) {
            toast.loading("Cargando informacion", {
                position: toast.POSITION.TOP_CENTER,
                progressClassName: 'success-progress-bar',
                toastId: 1
            });
            axios.get(API_BASE_URL_2 + `recurso/todos?lugarId=${placeId}`).then((response) => {
                if (response.data.length === 0) {
                    toast.update(1, { render: "No se encontro el recurso", type: toast.TYPE.ERROR, isLoading: false, autoClose: 2000 });
                } else {
                    setData(response.data[0])
                    toast.update(1, { render: "Informacion cargada", type: toast.TYPE.SUCCESS, isLoading: false, autoClose: 1000 });
                }
            }).catch((e) => {
                toast.update(1, { render: "Error obteniendo el recurso", type: toast.TYPE.ERROR, isLoading: false, autoClose: 2000 });
                console.log(e)
            });
        }
    }, []);


    if (data !== null) {
        location = {
            address: parseFloat(data.nombre),
            lng: parseFloat(data.coordenadas.latitud),
            lat: parseFloat(data.coordenadas.longitud),
        }
    }

    useEffect(() => {
        if (data != null) {
            if (data.status === "revisar") {
                setIsRevisar(true);
                setIsAceptado(false);
                setIsArchivado(false);
                setIsRechazado(false);
            }
            else if (data.status === "aceptado") {
                setIsAceptado(true)
                setIsRevisar(false);
                setIsArchivado(false);
                setIsRechazado(false);
            } else if (data.status === "archivado") {
                setIsArchivado(true);
                setIsRevisar(false);
                setIsAceptado(false);
                setIsRechazado(false);
            } else if (data.status === "rechazado") {
                setIsRechazado(true);
                setIsRevisar(false);
                setIsAceptado(false);
                setIsArchivado(false);
            }

        }

    }, [data]);


    const onAceptar = () => {
        notify();
        axios.post(baseUrl + "aceptar", {}, { params: { placeId: data.placeId } })
            .then((response) => {
                console.log(response);
                update();
                setIsRevisar(false);

            }).catch(error => {
                toast.update(toastId2.current, { render: "Error! " + error, type: toast.TYPE.ERROR, autoClose: 5000 });
                console.log('error' + error)
            });
    }

    const actualizarRecurso = (dataLugar) => {

        console.log(dataLugar);
        notify();
        axios.post(API_BASE_URL_2 + "admin/actualizar", {
            "estado": dataLugar.estado,
            "nombre": dataLugar.nombre,
            "descripcion": dataLugar.descripcion,
            "placeid": dataLugar.placeid
        },)
            .then((response) => {
                update();
                setIsRevisar(false);
            }).catch(error => {
                toast.update(toastId2.current, { render: "Error! " + error, type: toast.TYPE.ERROR, autoClose: 5000 });
                console.log('error' + error)
            });
    }

    return (
        <div className="one-place">

            {
                data === null
                    ? <h1>Cargando</h1>
                    :
                    <div >{

                        isAceptado ?  <div className='float-buttons'>
                            <Button variant="secondary" onClick={() => actualizarRecurso({
                                "estado": "archivado",
                                "nombre": data.nombre,
                                "descripcion": data.descripcion,
                                "placeid": placeId
                            })}>Archivar </Button>
                        </div>
                        : null
                        }
                        {
                            isRechazado || isArchivado ?   <div className='float-buttons'>
                            <Button variant="secondary" onClick={() => actualizarRecurso({
                                "estado": "revisar",
                                "nombre": data.nombre,
                                "descripcion": data.descripcion,
                                "placeid": placeId
                            })}>Revisar </Button>
                        </div>
                        : null
                        }
                        {
                        isRevisar ? <div className='float-buttons'>


                            <Button variant="danger" onClick={() => actualizarRecurso({
                                "estado": "rechazado",
                                "nombre": data.nombre,
                                "descripcion": data.descripcion,
                                "placeid": placeId
                            })}>Rechazar</Button>
                            <Button variant="success" onClick={() => actualizarRecurso({
                                "estado": "aceptado",
                                "nombre": data.nombre,
                                "descripcion": data.descripcion,
                                "placeid": placeId
                            })}>Aceptar </Button>
                            <Button variant="secondary" onClick={() => actualizarRecurso({
                                "estado": "archivado",
                                "nombre": data.nombre,
                                "descripcion": data.descripcion,
                                "placeid": placeId
                            })}>Archivar </Button>
                        </div>
                            : null
                    }



                        <div className='images-reel'>
                            <SliderImages imageList={data.imagenesPaths ? data.imagenesPaths : []}></SliderImages>
                        </div>
                        <div className='place-content'>
                            <h1>{data.nombre ? data.nombre : "Sin titulo"} </h1>
                            <p>{data.descripcion}</p>
                            <p>{data.userId}</p>
                            {
                                data != null && <Map location={location} zoomLevel={12} data={data} />
                            }


                        </div>

                    </div>

            }
        </div>
    );
}

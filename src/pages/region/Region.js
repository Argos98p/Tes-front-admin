import "./region.css"
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL_2 } from "../../API";
import { Grid } from "@mui/material";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBRipple } from "mdb-react-ui-kit";
import TextTruncate from "react-text-truncate";
import { toast } from "react-toastify";
import { BiCurrentLocation, BiPlus, BiUserCircle } from "react-icons/bi";
import { AiFillCheckCircle, AiOutlineHome } from "react-icons/ai"
import { BsClockHistory, BsFillArchiveFill } from "react-icons/bs"
import { MdOutlineCancel } from "react-icons/md"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button } from "react-bootstrap";
import OnePlace from "../onePlace/OnePlace";
import { Refresh } from "@mui/icons-material";




const RegionPage = () => {
    const [view, setView] = useState(1);
    const { state } = useLocation();
    const { element } = state;
    const navigate = useNavigate();
    const [lugares, setLugares] = useState([]);
    const [estadoLugar, setEstadoLugar] = useState("revisar");
    const [lugarSeleccionado, setLugarSelececionado] = useState(null);
    const [open, setOpen] = useState(false);
    const closeModal = () => {setOpen(false)};
    const [refresh,setRefresh] = useState(false)

    
    useEffect(() => {

        const id3 = toast.loading("Please wait...", {
            toastId: 'success1',
        })
        axios.get(API_BASE_URL_2 + `recurso/todos?regionId=${element.id}&estadoLugar=${estadoLugar}`).then((response) => {
            setLugares(response.data)
            if (response.data.length === 0) {
                //noData()
                toast.update(id3, { render: "No se encontraron recursos", type: "info", isLoading: false, toastId: "success1", autoClose: 700 });
            } else {
                //update()
                toast.update(id3, { render: "Recursos cargados", type: "success", isLoading: false, toastId: "success1", autoClose: 700 });
            }

        }).catch((e) => {
            toast.update(id3, { render: "Error recibiendo los recursos", type: "error", isLoading: false, toastId: "success1", autoClose: 700 });

            console.log(e)
        });
        return () => {
            setRefresh(false);
        };
    }, [estadoLugar,refresh])


    

    const redirectToPlacePage = (id) => {
        setLugarSelececionado(id);
        setOpen(true);

    }





    return (<>
        <div className={"region-container"}>
            <div className="sidebar">
                <div className="sidebarWrapper">
                    <div className="sidebarMenu">
                        <h3 className="sidebarTitle">Lugares</h3>
                        <ul className="sidebarList">
                        <p onClick={() => navigate("/admin/home")} className={"link"}  >
                                <li className="sidebarListItem ">
                                    <AiOutlineHome className="sidebarIcon"></AiOutlineHome>
                                    Home
                                </li>
                            </p>
                            <p onClick={() => setEstadoLugar("aceptado")} className={"link " + (estadoLugar === "aceptado" ? "active " : null)}  >
                                <li className="sidebarListItem ">
                                    <AiFillCheckCircle className="sidebarIcon"></AiFillCheckCircle>
                                    Aceptados
                                </li>
                            </p>
                            <p onClick={() => setEstadoLugar("rechazado")} className={"link " + (estadoLugar === "rechazado" ? "active " : null)}>
                                <li className="sidebarListItem">

                                    <BsClockHistory className="sidebarIcon"></BsClockHistory>
                                    Rechazados
                                </li>
                            </p>

                            <p onClick={() => setEstadoLugar("revisar")} className={"link " + (estadoLugar === "revisar" ? "active " : null)}>
                                <li className="sidebarListItem">
                                    <MdOutlineCancel className="sidebarIcon" />
                                    Por revisar
                                </li>
                            </p>


                            <p onClick={() => setEstadoLugar("archivado")} className={"link " + (estadoLugar === "archivado" ? "active " : null)}>
                                <li className="sidebarListItem">
                                    <BsFillArchiveFill className="sidebarIcon" />
                                    Archivados
                                </li>
                            </p>
                        </ul>
                    </div>



                </div>
            </div>



            <div className="region-content">
                <div className="mi-popup">
                    <Popup className="region-popup" open={open} closeOnDocumentClick onClose={closeModal}>
                        <div className="modalp">
                            <OnePlace placeId={lugarSeleccionado} />
                        </div>
                    </Popup>
                </div>



                <p className={"titulo"}>{element.nombre} </p>

                <div className="lugares-cards">
                    {Array.from(lugares).map((item, index) => (

                        <div style={{ cursor: "pointer" }} onClick={() => redirectToPlacePage(item.id)}>
                            <MDBCard style={{ "backgroundColor": '#fff' }}>

                                <MDBCardImage src={item['imagenesPaths'] ? item['imagenesPaths'][0] : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg"} fluid alt='...' />
                                <a>
                                    <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                                </a>

                                <MDBCardBody>
                                    <MDBCardTitle><b>{item['nombre']}</b></MDBCardTitle>
                                    <MDBCardText>
                                        <TextTruncate
                                            line={2}
                                            element="span"
                                            truncateText="…"
                                            text={item['descripcion']}
                                            textTruncateChild={<p style={{color:"blue",textDecoration:"underline"}}>Leer mas</p>}
                                        />

                                    </MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </div>

                    ))}
                </div>


            </div>

        </div>

    </>);
}

export default RegionPage;
import React, {useState, useContext}from "react";
import './PlaceItem.css';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from "../../shared/context/auth-context";

const PlaceItem =props =>{
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModel, setShowConfirmModal] = useState(false);



    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () =>setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () =>{
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = ()=> {
        console.log('Deleting...');
        setShowConfirmModal(false);
    };

    const auth = useContext(AuthContext);
 
    return (
        <>
        <Modal 
        show={showMap} 
        onCancel={closeMapHandler} 
        header={props.address} 
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler} > BACKDROP </Button>} >
            <div className="map-container">
                <Map/>
            </div>
        </Modal>
        <Modal show={showConfirmModel} onCancel={cancelDeleteHandler} header="Deleting...Are you sure?" footerClass="place-item__model-actions" footer={
            <>
            <Button onClick={cancelDeleteHandler} inverse>CANCEL</Button>
            <Button onClick={confirmDeleteHandler} danger>DELETE</Button>
            </>
        } >
            <p>Do you want to delete this place? Sure? It won't be recovered later</p>
        </Modal>
        <li className="place-item">
            <Card className="place-item__content" >
                <div className="place-item__image">
                    <img src={props.image} alt={props.title}/>
                </div>
                <div className="place-item__info">
                    <h2>{props.title}</h2>
                    <h3> {props.address} </h3>
                    <p> {props.description} </p>
                </div>
                <div className="place-item__actions">
                    <Button inverse onClick={openMapHandler} >VIEW ON MAP</Button>
                    {auth.isLoggedIn && (<Button to={`/places/${props.id}`}>EDIT</Button>) }
                    {auth.isLoggedIn && (<Button onClick={showDeleteWarningHandler} danger>DELETE</Button>)}
                </div>
        </Card>
        </li>
        </>
    );
};

export default PlaceItem;

// on VIEW map model should be shown and when backdrop is clicked should disappear
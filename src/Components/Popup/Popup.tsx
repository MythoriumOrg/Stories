import React from 'react';
import './Popup.css';
import { SerieData } from "../../Interfaces/SerieData.ts";
import VolumeCard from "../VolumeCard/VolumeCard.tsx";

interface PopupProps {
    serieData: SerieData;
    onClose: () => void;
    isClosing: boolean;
}

const Popup: React.FC<PopupProps> = ({ serieData, onClose, isClosing }) => {

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className={`popup-content ${isClosing ? 'zoom-out' : 'zoom-in'}`}
                onClick={e => e.stopPropagation()}
                style={{ background: `linear-gradient(to bottom, rgba(47, 47, 47, 0) 20%, rgba(47, 47, 47, 1) 65%), url("/serieLogo/${serieData.images}/fond.png")` }}
            >
                <img src={`/serieLogo/${serieData.images}/logoSerie.png`} alt="logo serie" className="popup-logo"/>
                {serieData.volumes.map((tome, index) => (
                    <VolumeCard key={index} volumeData={tome} images={serieData.images}/>
                ))}
            </div>
        </div>
    );
};

export default Popup;
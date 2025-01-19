import React from 'react';
import './Popup.css';
import { SerieData } from "../../Interfaces/SerieData.ts";

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
            >
                {serieData.name}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
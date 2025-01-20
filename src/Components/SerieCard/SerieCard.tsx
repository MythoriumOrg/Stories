import "./SerieCard.css";
import { SerieData } from "../../Interfaces/SerieData.ts";
import Popup from "../Popup/Popup.tsx";
import { useState } from "react";

interface SerieCardProps {
    serieData: SerieData;
}

function SerieCard({ serieData }: SerieCardProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleCardClick = () => {
        setIsPopupOpen(true);
        setIsClosing(false);
    };

    const handleClosePopup = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsPopupOpen(false);
        }, 300); // Match the duration of the animation
    };

    return (
        <div>
            <div className="card-body" onClick={handleCardClick}>
                <img src={`/series/${serieData.url}/card.png`} />
            </div>
            {isPopupOpen && (
                <Popup onClose={handleClosePopup} serieData={serieData} isClosing={isClosing} />
            )}
        </div>
    );
}

export default SerieCard;
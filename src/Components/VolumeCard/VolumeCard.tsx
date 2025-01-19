import {Volume} from "../../Interfaces/Volume.ts";
import "./VolumeCard.css";

interface VolumeCardProps {
    volumeData: Volume;
    images: string;
}

function VolumeCard({volumeData, images}: VolumeCardProps) {
    const handleVolumeSelection = () => {
        window.location.href = `${process.env.REACT_APP_READING_URL}/?volume=${volumeData.url}`;
    }

    return (
        <div className="volumeCard-body" onClick={handleVolumeSelection}>
            <img src={`/serieLogo/${images}/volume${volumeData.number}.png`} alt="logo serie"
                 className="volumeCard-cover"/>
            <div className="volumeCard-infos">
                <div>Tome {volumeData.number}</div>
                <div>{volumeData.title}</div>
            </div>
        </div>
    );

}

export default VolumeCard;
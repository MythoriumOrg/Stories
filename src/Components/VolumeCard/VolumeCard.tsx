import {Volume} from "../../Interfaces/Volume.ts";
import "./VolumeCard.css";

interface VolumeCardProps {
    volumeData: Volume;
    url: string;
}

function VolumeCard({volumeData, url}: VolumeCardProps) {
    const handleVolumeSelection = () => {
        window.location.href = `${process.env.REACT_APP_BASE_URL}/read/?url=${url}&volume=${volumeData.number}`;
    }

    return (
        <div className="volumeCard-body" onClick={handleVolumeSelection}>
            <img src={`/series/${url}/volume${volumeData.number}/cover.png`} alt="logo serie"
                 className="volumeCard-cover"/>
            <div className="volumeCard-infos">
                <div>Tome {volumeData.number}</div>
                <div>{volumeData.title}</div>
            </div>
        </div>
    );

}

export default VolumeCard;
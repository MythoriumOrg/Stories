import {Volume} from "../../Interfaces/Volume.ts";
import {useNavigate} from "react-router-dom";
import "./VolumeCard.css";

interface VolumeCardProps {
    volumeData: Volume;
    url: string;
}

function VolumeCard({volumeData, url}: VolumeCardProps) {
    const navigate = useNavigate();

    const handleVolumeSelection = () => {
        navigate(`/read?url=${url}&volume=${volumeData.number}`);
    }

    return (
        <div className="volumeCard-body" onClick={handleVolumeSelection}>
            <img src={`/series/${url}/volume${volumeData.number}/cover.png`} alt="logo serie"
                 className="volumeCard-cover"/>
            <div className="volumeCard-infos">
                {volumeData.number !== 0 && <div>Tome {volumeData.number}</div>}
                <div>{volumeData.title}</div>
            </div>
        </div>
    );

}

export default VolumeCard;
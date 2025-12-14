import seriesData from '../../data/seriesData.json'
import SerieCard from "../SerieCard/SerieCard.tsx";
import './Homepage.css'

function Homepage() {
    return (
        <div className="body">
            <div className="series-cards">
                {seriesData.map((serie, index) => (
                    <SerieCard key={index} serieData={serie}/>
                ))}
            </div>
        </div>
    )
}

export default Homepage
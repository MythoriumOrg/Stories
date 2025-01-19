import './App.css'
import SerieCard from "./Components/SerieCard/SerieCard.tsx";
import seriesData from "../public/data/seriesData.json";

function App() {
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

export default App
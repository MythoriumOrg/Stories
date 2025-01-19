import './App.css'
import SerieCard from "./Components/SerieCard/SerieCard.tsx";

function App() {

    return (
        <div className="body">
            <div className="series-cards">
                <SerieCard></SerieCard>
                <SerieCard></SerieCard>
                <SerieCard></SerieCard>
                <SerieCard></SerieCard>
                <SerieCard></SerieCard>
            </div>
        </div>
    )
}

export default App

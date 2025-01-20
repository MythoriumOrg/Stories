import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Reader from "./Components/Reader/Reader.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/read" element={<Reader />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
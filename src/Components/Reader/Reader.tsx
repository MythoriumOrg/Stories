import "./Reader.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {ReaderPrams} from "../../Interfaces/ReaderPrams.ts";

function Reader() {
    const [story, setStory] = useState('');
    const [fontSize, setFontSize] = useState(10);
    const [pageSize, setPageSize] = useState(30);
    const [theme, setTheme] = useState('light'); // Add state for theme

    const readerParams: ReaderPrams = {
        fontSize: 1 + (fontSize - 1) * 0.04, // Scale fontSize from 1 to 5
        pageSize: 30 + (pageSize - 1) * .75, // Scale pageSize from 30 to 80
        theme: theme
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get('url');
        const volume = params.get('volume');

        console.log('Fetching story:', url, volume);
        console.log(`/series/${url}/volume${volume}/story.html`)
        fetch(`/series/${url}/volume${volume}/story.html`)
            .then(response => response.text())
            .then(data => setStory(data))
            .catch(error => console.error('Error fetching story:', error));
    }, []);

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFontSize(Number(event.target.value));
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(Number(event.target.value));
    }

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    }

    return (
        <div>
            <div className="header">
                <Link className="header-bouton-retour" to="/">
                    {`< Retour`}
                </Link>
                <div className="header-options">
                    <div>
                        <label>
                            Thème :
                        </label>
                        <select value={theme} onChange={handleThemeChange}>
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                        </select>
                    </div>

                    <div>
                        <label>
                            Taille de la page :
                        </label>
                        <input
                            type="range"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="header-input"
                        />
                    </div>

                    <div>
                        <label>
                            Taille de la police :
                        </label>
                        <input
                            type="range"
                            value={fontSize}
                            onChange={handleFontSizeChange}
                            className="header-input"
                        />
                    </div>
                </div>
            </div>
            <div className={`story-html theme-${theme}`} dangerouslySetInnerHTML={{__html: story}}
                 style={{fontSize: `${readerParams.fontSize}rem`, width: `${readerParams.pageSize}rem`}}>
            </div>
        </div>
    );
}

export default Reader;
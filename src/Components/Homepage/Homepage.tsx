import {useEffect, useMemo, useState} from "react";
import seriesData from '../../data/seriesData.json';
import SerieCard from "../SerieCard/SerieCard.tsx";
import './Homepage.css';

function Homepage() {
    const imageUrls = useMemo(() => {
        const urls = new Set<string>();

        seriesData.forEach((serie) => {
            urls.add(`/series/${serie.url}/card.png`);
            urls.add(`/series/${serie.url}/fond.png`);
            urls.add(`/series/${serie.url}/logoSerie.png`);

            serie.volumes.forEach((volume) => {
                urls.add(`/series/${serie.url}/volume${volume.number}/cover.png`);
            });
        });

        return Array.from(urls);
    }, []);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imageUrls.length === 0) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        const preloadImages = async () => {
            await Promise.all(
                imageUrls.map(
                    (src) =>
                        new Promise<void>((resolve) => {
                            const img = new Image();
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                            img.src = src;
                        })
                )
            );

            if (isMounted) {
                setIsLoading(false);
            }
        };

        preloadImages();

        return () => {
            isMounted = false;
        };
    }, [imageUrls]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        const initialLoader = document.getElementById("initial-loader");
        if (initialLoader) {
            initialLoader.remove();
        }
    }, [isLoading]);

    return (
        <div className="body">
            {!isLoading && (
                <div className="series-cards">
                    {seriesData.map((serie, index) => (
                        <SerieCard key={index} serieData={serie}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Homepage

import "./Reader.css";
import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {ReaderPrams} from "../../Interfaces/ReaderPrams.ts";

function Reader() {
    const [story, setStory] = useState('');
    const [fontSize, setFontSize] = useState(10);
    const [pageSize, setPageSize] = useState(30);
    const [theme, setTheme] = useState('light'); // Add state for theme
    const [chapters, setChapters] = useState<{id: string; title: string}[]>([]);
    const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const storyContainerRef = useRef<HTMLDivElement>(null);
    const chapterMenuRef = useRef<HTMLDivElement>(null);
    const stickyOffsetRef = useRef(0);

    const escapeId = (value: string) => {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
            return CSS.escape(value);
        }

        return value.replace(/([#.;?+*~':"!^$\[\]()=>|/@])/g, '\\$1');
    };

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

    useEffect(() => {
        const container = storyContainerRef.current;

        if (!container) {
            setChapters([]);
            setActiveChapterId(null);
            return;
        }

        const headings = Array.from(container.querySelectorAll('h3')) as HTMLElement[];

        if (!headings.length) {
            setChapters([]);
            setActiveChapterId(null);
            return;
        }

        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        stickyOffsetRef.current = parseFloat(getComputedStyle(headings[0]).top || '') || (5 * fontSize);

        const slugify = (value: string, fallbackIndex: number) => {
            const base = value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            return base.length ? base : `chapitre-${fallbackIndex}`;
        };

        const ensureUniqueId = (baseId: string, takenIds: Set<string>) => {
            let id = baseId;
            let index = 2;

            while (takenIds.has(id)) {
                id = `${baseId}-${index}`;
                index += 1;
            }

            takenIds.add(id);
            return id;
        };

        const usedIds = new Set<string>();
        const discoveredChapters = headings.map((heading, index) => {
            const text = heading.textContent?.trim() || `Chapitre ${index + 1}`;
            const existingId = heading.id?.trim();

            if (existingId) {
                usedIds.add(existingId);
                heading.classList.add('chapter-heading');
                return {id: existingId, title: text};
            }

            const candidateId = slugify(text, index + 1);
            const id = ensureUniqueId(candidateId, usedIds);

            heading.id = id;
            heading.classList.add('chapter-heading');

            return {id, title: text};
        });

        setChapters(discoveredChapters);
        setMenuOpen(false);
        setActiveChapterId(previous => {
            if (previous && discoveredChapters.some(chapter => chapter.id === previous)) {
                return previous;
            }

            return discoveredChapters[0]?.id ?? null;
        });

        let ticking = false;

        const updateStickyState = () => {
            const stickyTop = stickyOffsetRef.current + 0.5;

            headings.forEach((heading) => {
                const rect = heading.getBoundingClientRect();
                const isStuck = rect.top <= stickyTop && rect.bottom > stickyTop;

                heading.classList.toggle('is-stuck', isStuck);

                if (isStuck) {
                    setActiveChapterId(current => (current === heading.id ? current : heading.id));
                }
            });
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateStickyState();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, {passive: true});
        updateStickyState();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveChapterId(entry.target.id);
                }
            });
        }, {rootMargin: `-${Math.ceil(stickyOffsetRef.current + 8)}px 0px -70% 0px`, threshold: 0});

        headings.forEach((heading) => observer.observe(heading));

        const onHeadingClick = (event: Event) => {
            event.stopPropagation();
            const target = event.currentTarget as HTMLElement;
            setActiveChapterId(target.id);
            setMenuOpen(previous => !previous);
        };

        headings.forEach((heading) => heading.addEventListener('click', onHeadingClick));

        return () => {
            window.removeEventListener('scroll', onScroll);
            observer.disconnect();
            headings.forEach((heading) => {
                heading.classList.remove('chapter-heading', 'is-stuck');
                heading.removeEventListener('click', onHeadingClick);
            });
        };
    }, [story]);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (chapterMenuRef.current?.contains(event.target as Node)) {
                return;
            }

            setMenuOpen(false);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

	useEffect(() => {
		const displayNotes = () => {
			const container = storyContainerRef.current ?? document;
			container.querySelectorAll("p.note-auteur").forEach((note) => {
				if (note instanceof HTMLElement) {
					note.style.display = "block";
				}
			});
		};

		(window as typeof window & { displayNotes?: () => void }).displayNotes = displayNotes;

		return () => {
			const win = window as typeof window & { displayNotes?: () => void };
			if (win.displayNotes === displayNotes) {
				delete win.displayNotes;
			}
		};
	}, []);

	useEffect(() => {
		const displayNotesPerso = () => {
			const container = storyContainerRef.current ?? document;
			container.querySelectorAll("p.note-perso").forEach((note) => {
				if (note instanceof HTMLElement) {
					note.style.display = "block";
				}
			});
		};

		(window as typeof window & { displayNotesPerso?: () => void }).displayNotesPerso = displayNotesPerso;

		return () => {
			const win = window as typeof window & { displayNotesPerso?: () => void };
			if (win.displayNotesPerso === displayNotesPerso) {
				delete win.displayNotesPerso;
			}
		};
	}, []);

    const scrollToChapter = (id: string) => {
        const container = storyContainerRef.current;

        if (!container) {
            return;
        }

        const target = container.querySelector(`#${escapeId(id)}`);

        if (target instanceof HTMLElement) {
            setMenuOpen(false);
            setActiveChapterId(id);

            const stickyOffset = stickyOffsetRef.current || 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({top: Math.max(targetTop - stickyOffset, 0), behavior: 'smooth'});
        }
    };

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
            <div
                ref={storyContainerRef}
                className={`story-html theme-${theme}`}
                dangerouslySetInnerHTML={{__html: story}}
                style={{fontSize: `${readerParams.fontSize}rem`, width: `${readerParams.pageSize}rem`}}
            >
            </div>
            {menuOpen && chapters.length > 0 && (
                <div
                    className={`chapter-menu theme-${theme}`}
                    ref={chapterMenuRef}
                    onClick={(event) => event.stopPropagation()}
                >
                    <ul>
                        {chapters.map((chapter) => (
                            <li key={chapter.id}>
                                <button
                                    type="button"
                                    className={chapter.id === activeChapterId ? 'is-active' : ''}
                                    onClick={() => scrollToChapter(chapter.id)}
                                >
                                    {chapter.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Reader;

import { createContext, useContext, useEffect, useState } from 'react';

// Crear el contexto
const TemaContext = createContext();

/**
 * Proveer el contexto en un componente de alto nivel.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
export const TemaProvider = ({ children }) => {
    // Cargar la preferencia de tema desde localStorage o usar claro por defecto
    const [temaOscuro, setTemaOscuro] = useState(() => {
        return localStorage.getItem('temaOscuro') === 'true'; // Convertir a booleano
    });

    const [colorFondo, setColorFondo] = useState(temaOscuro ? '#332d2d' : '#FFFFFF');
    const [colorTexto, setColorTexto] = useState(temaOscuro ? '#FFFFFF' : '#000000');
    const [colorIcono, setColorIcono] = useState(temaOscuro ? '#FFFFFF' : '#ffa600');
    const [imageFondo, setimageFondo] = useState(temaOscuro ? 'urlimagen claro' : 'urlimagen oscuro');

    /**
     * Toggle the theme between dark and light.
     */
    const toggleTema = () => {
        setTemaOscuro(prevTema => {
            const nuevoTema = !prevTema;
            localStorage.setItem('temaOscuro', nuevoTema); // Guardar en localStorage
            return nuevoTema;
        });
    };

    // Efecto para actualizar los colores cada vez que cambia el tema
    useEffect(() => {
        setColorFondo(temaOscuro ? '#332d2d' : '#FFFFFF');
        setColorTexto(temaOscuro ? '#FFFFFF' : '#000000');
        setColorIcono(temaOscuro ? '#FFFFFF' : '#ffa600');
        setimageFondo(temaOscuro ? 'urlimagen claro' : 'urlimagen oscuro');
    }, [temaOscuro]);

    return (
        <TemaContext.Provider value={{ temaOscuro, colorFondo, colorTexto, colorIcono, toggleTema, imageFondo }}>
            {children}
        </TemaContext.Provider>
    );
};

/**
 * Hook para acceder al contexto.
 * @returns {Object} The theme context.
 */
export const useTema = () => {
    return useContext(TemaContext);
};
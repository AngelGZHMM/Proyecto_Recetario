import Menu from "../components/Menu";
import { TemaProvider } from '../components/ThemeProvider';

/**
 * Componente de la página principal que incluye el menú de navegación.
 * @returns {JSX.Element} El componente de la página principal.
 */
function Home(){
    return (
        <TemaProvider>
            <Menu position="fixed"/>
            {/* Aqui no se encuentra el Oulet esta dentro del componente Menu */}
        </TemaProvider>
    );
}

export default Home;
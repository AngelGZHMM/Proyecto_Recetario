
import Menu from "../components/Menu";  
import { TemaProvider } from '../components/ThemeProvider';


function Home(){
    return (
        <TemaProvider>
            <Menu position="fixed"/>
            {/* Aqui no se encuentra el Oulet esta dentro del componente Menu */}
        </TemaProvider>
   
    );
}
export default Home;
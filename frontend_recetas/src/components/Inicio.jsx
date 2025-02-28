import  { useState, useEffect } from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import { Box } from "@mui/system";
import { useTema } from "./ThemeProvider";

function Inicio() {
  const { colorFondo } = useTema();
  const [recetas, setRecetas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecetas() {
      try {
        let response = await fetch(`${apiUrl}/receta`);
        if (response.ok) {
          let data = await response.json();
          setRecetas(data.datos);
        } else {
          console.error("Error fetching recetas:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching recetas:", error);
      }
    }

    fetchRecetas();
  }, []);

  return (
    <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
      <MDBCarousel showControls showIndicators interval={3000} style={{ height: "70%", padding: 10 }}>
        {recetas.map((receta, index) => (
          <MDBCarouselItem key={receta.receta_id} itemId={index + 1} style={{ height: 500 }}>
            <img
              src={receta.imagen}
              className="d-block w-100"
              alt={receta.nombre}
              style={{
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div className="carousel-caption d-none d-md-block">
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '10px', borderRadius: '5px' }}>
                <h5 style={{ color: 'black' }}>{receta.nombre}</h5>
                <p style={{ color: 'black' }}>{receta.descripcion}</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/pasosreceta/${receta.receta_id}`)}
              >
                Ver Pasos
              </button>
            </div>
          </MDBCarouselItem>
        ))}
      </MDBCarousel>
    </Box>
  );
}

export default Inicio;
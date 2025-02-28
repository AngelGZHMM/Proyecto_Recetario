import { Box, Button, Typography } from "@mui/material";
import { TemaProvider } from "../components/ThemeProvider";

/**
 * Componente de página de error que se muestra cuando no se encuentra la página solicitada.
 * @returns {JSX.Element} El componente de la página de error.
 */
function PaginaError() {
  return (
    <TemaProvider>
      <Typography variant="h4" align="center" sx={{ mt: 30, ml: 2 }}>
        No hemos encontrado la página que buscas
      </Typography>
      <Box textAlign={"center"} sx={{ mt: 2 }}>
        <Button variant="contained" align="center" href="/" sx={{ mt: 2 }}>
          Ir a la página princial
        </Button>
      </Box>
    </TemaProvider>
  );
}

export default PaginaError;
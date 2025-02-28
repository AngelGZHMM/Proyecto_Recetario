import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { apiUrl } from "../config";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTema } from "./ThemeProvider"; // Asegúrate de que la ruta sea correcta
import generatePDF from "../utils/generatePDF.js";
import Button from "@mui/material/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GraficaPasosPDF from "./GraficaPasosPDF"; // Importa el nuevo componente PDF

function GraficaPasos() {
  const {  colorFondo, colorTexto, colorIcono } = useTema();
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function getDatosGraficaPasos() {
      try {
        let response = await fetch(apiUrl + "/pasos/grafica");
        if (response.ok) {
          const data = await response.json();
          console.log("Datos de la gráfica:", data); // Añadir log para verificar los datos
          // Mapeamos los datos para mostrar "Receta X" en el eje X
          const datosGrafica = data.datos.map((item) => ({
            receta: `Receta ${item.receta}`,
            numpasos: item.numpasos,
          }));
          setDatos(datosGrafica);
        } else {
          console.error("Error al obtener los datos de la gráfica:", response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la gráfica:", error);
      }
    }

    getDatosGraficaPasos();
  }, []);

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: colorFondo, // Aplicar color de fondo
        color: colorTexto, // Aplicar color de texto
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Número de Pasos por Receta
      </Typography>
      <Box sx={{ width: "100%", maxWidth: 800, height: 400 }} id="pdf-content">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={datos}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke={colorTexto} strokeDasharray="5 5" /> {/* Aplicar color de texto */}
            <XAxis dataKey="receta" stroke={colorTexto} /> {/* Aplicar color de texto */}
            <YAxis stroke={colorTexto} /> {/* Aplicar color de texto */}
            <Tooltip />
            <Bar dataKey="numpasos" fill={colorIcono} barSize={30} /> {/* Aplicar color de icono */}
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mx: 4, mt: 2 }}>
        <Typography variant="h4" align="center">
          {datos.length === 0 ? "Cargando..." : ""}
        </Typography>
        <Button variant="contained" onClick={() => generatePDF("pdf-content")}>
          Imprimir listado (jsPDF + html2canvas)
        </Button>
        <Button variant="contained" >
          <PDFDownloadLink
            document={<GraficaPasosPDF data={datos} />}
            fileName="tabla.pdf"
          >
            {({ loading }) =>
              loading ? "Generando PDF..." : "Imprimir listado (react-pdf)"
            }
          </PDFDownloadLink>
        </Button>
        <Button variant="contained" onClick={() => window.print()}>
          Imprimir listado (navegador)
        </Button>
      </Box>
    </Box>
  );
}

export default GraficaPasos;
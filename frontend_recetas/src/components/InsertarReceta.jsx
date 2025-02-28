import { Typography, Stack, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import { Box } from "@mui/material";
import { useTema } from "./ThemeProvider";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function InsertarReceta() {
  const navigate = useNavigate();
  const { colorFondo, colorTexto } = useTema();

  const [datos, setDatos] = useState({
    nombre: "",
    imagen: "",
    descripcion: "",
    tiempo_preparacion: "",
    dificultad: "Facil",
    fecha_creacion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl + "/receta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const respuesta = await response.json();
        if (respuesta.ok) {
          navigate("/");
        }
        alert(respuesta.mensaje);
      } else {
        alert("Error al crear la receta");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDificultad = (e) => {
    setDatos({
      ...datos,
      dificultad: e.target.value,
    });
  };

  const getSelectColor = (dificultad) => {
    switch (dificultad) {
      case "Extremo":
        return "red";
      case "Facil":
        return "green";
      case "Intermedio":
        return "yellow";
      case "Avanzado":
        return "orange";
      default:
        return "grey";
    }
  };

  return (
    <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
      <Typography variant="h4" align="center" sx={{ mt: 4, color: colorTexto }}>
        Insertar Receta
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            spacing={2}
            component="form"
            sx={{ mx: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Nombre"
              variant="outlined"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                }, // Color del borde del input
              }}
            />
            {datos.imagen && (
              <Box
                sx={{
                  display: { xs: "none", sm: "block" }, // Oculta en tamaños xs, muestra en sm y superiores
                }}
              >
                <img
                  src={datos.imagen}
                  alt="Imagen de la receta"
                  style={{
                    width: "100%", // Ocupa el ancho de los inputs
                    height: "calc(2 * 150px + 16px)", // Ocupa la altura de dos inputs (56px cada uno) más el espacio entre ellos (16px)
                    objectFit: "cover", // Asegura que la imagen se ajuste bien dentro del contenedor
                    borderRadius: "16px", // Bordes redondeados
                  }}
                />
              </Box>
            )}

            <TextField
              label="Url Imagen"
              variant="outlined"
              name="imagen"
              value={datos.imagen}
              onChange={handleChange}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                }, // Color del borde del input
              }}
            />

            <TextField
              label="Descripcion"
              variant="outlined"
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                }, // Color del borde del input
              }}
            />

            <TextField
              label="Tiempo de preparación (ms)"
              variant="outlined"
              name="tiempo_preparacion"
              value={datos.tiempo_preparacion}
              onChange={handleChange}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                }, // Color del borde del input
              }}
            />

            {/* Selector de dificultad */}
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel sx={{ color: colorTexto }}>Dificultad</InputLabel>
              <Select
                name="dificultad"
                value={datos.dificultad}
                onChange={handleChangeDificultad}
                input={<OutlinedInput label="Dificultad" />}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: getSelectColor(datos.dificultad),
                  }, // Cambia borde
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  }, // Borde cuando está enfocado
                  "& .MuiInputBase-input": { color: colorTexto }, // Color del texto ingresado
                }}
              >
                <MenuItem value="Extremo">Extremo</MenuItem>
                <MenuItem value="Avanzado">Avanzado</MenuItem>
                <MenuItem value="Intermedio">Intermedio</MenuItem>
                <MenuItem value="Facil">Fácil</MenuItem>
              </Select>
              <Box
                sx={{
                  backgroundColor: getSelectColor(datos.dificultad),
                  height: 10,
                  width: 500,
                  borderRadius: "16px", // Bordes redondeados
                }}
              ></Box>
            </FormControl>

            <Button type="submit" variant="contained">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InsertarReceta;
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";
import { useTema } from "./ThemeProvider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

/**
 * ModificarReceta component.
 * @returns {JSX.Element} The component.
 */
function ModificarReceta() {
  const { colorFondo, colorTexto } = useTema();
  const params = useParams();
  const [datos, setDatos] = useState({
    receta_id: params.receta_id,
    nombre: "",
    descripcion: "",
    tiempo_preparacion: "",
    dificultad: "",
    fecha_creacion: "",
    imagen: "",
  });
  const [validacion, setValidacion] = useState({
    nombre: false, // true si hay error
    descripcion: false,
    tiempo_preparacion: false,
    dificultad: false,
    fecha_creacion: false,
  });

  const navigate = useNavigate();

  /**
   * Handle change for dificultad select.
   * @param {Object} e - The event object.
   */
  const handleChangeDificultad = (e) => {
    setDatos({
      ...datos,
      dificultad: e.target.value,
    });
  };

  useEffect(() => {
    async function getRecetaById() {
      let response = await fetch(apiUrl + "/receta/" + datos.receta_id);
      if (response.ok) {
        let data = await response.json();
        setDatos(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/"); // Volver a la página principal por ruta erronea
      }
    }

    getRecetaById();
  }, []); // Se ejecuta solo en el primer renderizado

  /**
   * Get color for select based on dificultad.
   * @param {string} dificultad - The dificultad value.
   * @returns {string} The color.
   */
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

  /**
   * Handle form submit.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    // No hacemos submit
    e.preventDefault();
    console.log("Vamos a validar");
    if (validarDatos()) {
      // Enviamos los datos mediante fetch
      try {
        console.log("Vamos a hacer fetch");
        const response = await fetch(apiUrl + "/receta/" + datos.receta_id, {
          method: "PUT", // "PATCH"
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos), // JSON.stringify({blocked: true})
        });

        if (response.ok) {
          // 204 No content
          alert("Actualización correcta");
          navigate("/"); // Volver al home
        } else {
          // 404 Not Found plato no modificado o no encontrado
          const data = await response.json();
          alert(data.mensaje);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error:", error);
      }
    }
  };

  /**
   * Validate form data.
   * @returns {boolean} True if valid, false otherwise.
   */
  function validarDatos() {
    // En principio, damos por bueno el formulario
    let validado = true;
    // Estado de la validación auxiliar
    let validacionAux = {
      nombre: false,
      descripcion: false,
      tiempo_preparacion: false,
      dificultad: false,
      fecha_creacion: false,
    };

    if (datos.nombre.length < 3) {
      // Error en el nombre
      validacionAux.nombre = true;
      // Formulario invalido
      validado = false;
    }

    if (datos.descripcion.length < 10) {
      validacionAux.descripcion = true;
      validado = false;
    }

    // Actualizo el estado de la validacion de los Textfields
    setValidacion(validacionAux);
    console.log("Formulario valido:", validado);
    return validado;
  }

  /**
   * Handle change for input fields.
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  console.log("Datos:", datos);
  return (
    <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 2, color: colorTexto, backgroundColor: colorFondo }}
      >
        Modificar receta
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
          color: colorTexto,
          backgroundColor: colorFondo,
        }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ mx: 2 }}
          >
            <TextField
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              error={validacion.nombre}
              helperText={
                validacion.nombre && "Nombre incorrecto. Mínimo 3 caracteres"
              }
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                //color del borde del input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />

            <img src={datos.imagen} alt={datos.nombre} loading="lazy" />

            <TextField
              id="outlined-basic"
              label="Url imagen"
              variant="outlined"
              name="imagen" // Cambia 'urlimagen' a 'imagen'
              value={datos.imagen}
              onChange={handleChange} // Agrega esta línea
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                //color del borde del input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />

            <TextField
              id="outlined-basic"
              label="Descripcion"
              variant="outlined"
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              error={validacion.descripcion}
              helperText={
                validacion.descripcion &&
                "Descripción requerida. Minimo 10 caracteres"
              }
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                //color del borde del input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
              multiline
            />
            <TextField
              id="outlined-basic"
              label="Tienpo de preparacion"
              variant="outlined"
              name="tiempo_preparacion"
              value={datos.tiempo_preparacion}
              onChange={handleChange}
              error={validacion.tiempo_preparacion}
              helperText={
                validacion.tiempo_preparacion && "Tiempo minimo requerido 1min"
              }
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                //color del borde del input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />

            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Dificultad</InputLabel>
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
                  width: 415,
                  borderRadius: "16px", // Bordes redondeados
                }}
              ></Box>
            </FormControl>

            <TextField
              id="outlined-basic"
              label="Fecha de creacion"
              variant="outlined"
              name="fecha_creacion"
              value={datos.fecha_creacion}
              onChange={handleChange}
              error={validacion.fecha_creacion}
              helperText={validacion.fecha_creacion && "Fecha requerida"}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                //color del borde del input
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />

            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ModificarReceta;

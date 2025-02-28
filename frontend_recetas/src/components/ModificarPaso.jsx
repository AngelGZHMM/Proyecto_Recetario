import { Avatar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";
import { useTema } from "./ThemeProvider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

/**
 * ModificarPaso component allows the user to modify a step in a recipe.
 * It fetches the step data and recipe data from the API and displays it in a form.
 * The user can modify the data and submit the form to update the step.
 */
function ModificarPaso() {
  const { colorFondo, colorTexto } = useTema();
  const params = useParams();
  const [datos, setDatos] = useState({
    receta: params.receta_id,
    orden: params.orden,
    descripcion: "",
    ingrediente: "",
    cantidad: "",
    unidad_medida: "",
    tipo: "",
    duracion: "",
  });
  const [receta, setReceta] = useState(""); // Estado para almacenar los datos de la receta
  const [validacion, setValidacion] = useState({
    descripcion: false,
    ingrediente: false,
    cantidad: false,
    unidad_medida: false,
    tipo: false,
    duracion: false,
  });
  const [loading, setLoading] = useState(true); // Estado de carga

  const navigate = useNavigate();

  useEffect(() => {
    async function getPasoById() {
      try {
        let response = await fetch(
          `${apiUrl}/pasos/${params.orden}/${params.receta_id}`
        );
        if (response.ok) {
          let data = await response.json();
          setDatos(data.datos);
          setLoading(false); // Datos cargados
        } else if (response.status === 404) {
          let data = await response.json();
          alert(data.mensaje);
          navigate("/"); // Volver a la página principal por ruta erronea
        } else {
          console.error("Error fetching paso:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching paso:", error);
      }
    }

    async function getRecetaById() {
      try {
        let response = await fetch(`${apiUrl}/receta/${params.receta_id}`);
        if (response.ok) {
          let data = await response.json();
          setReceta(data.datos); // Almacena los datos de la receta
        } else {
          console.error("Error fetching receta:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching receta:", error);
      }
    }

    getPasoById();
    getRecetaById();
  }, [params.orden, params.receta_id]); // Se ejecuta solo en el primer renderizado

  const handleSubmit = async (e) => {
    // No hacemos submit
    e.preventDefault();
    console.log("Vamos a validar");
    if (validarDatos()) {
      // Enviamos los datos mediante fetch
      try {
        console.log("Vamos a hacer fetch");
        const response = await fetch(
          `${apiUrl}/pasos/${params.orden}/${params.receta_id}`,
          {
            method: "PUT", // "PATCH"
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos), // JSON.stringify({blocked: true})
          }
        );

        if (response.ok) {
          // 204 No content
          alert("Actualización correcta");
          navigate("/"); // Volver al home
        } else {
          // 404 Not Found paso no modificado o no encontrado
          const data = await response.json();
          alert(data.mensaje);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error:", error);
      }
    }
  };

  function validarDatos() {
    // En principio, damos por bueno el formulario
    let validado = true;
    // Estado de la validación auxiliar
    let validacionAux = {
      descripcion: false,
      ingrediente: false,
      cantidad: false,
      unidad_medida: false,
      tipo: false,
      duracion: false,
    };

    if (datos.descripcion.length < 10) {
      validacionAux.descripcion = true;
      validado = false;
    }

    // Actualizo el estado de la validacion de los Textfields
    setValidacion(validacionAux);
    console.log("Formulario valido:", validado);
    return validado;
  }

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  console.log("Datos:", datos);
  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  return (
    <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          mt: 2,
          color: colorTexto,
          backgroundColor: colorFondo,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Modificar Paso de {receta.nombre}
        <Avatar
          src={receta.imagen}
          sx={{ width: "15%", height: "15%", ml: 2 }}
        />
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
              label="Orden"
              variant="outlined"
              name="orden"
              value={datos.orden}
              onChange={handleChange}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Descripción"
              variant="outlined"
              name="descripcion"
              value={datos.descripcion || ""} // Asegúrate de que el valor no sea undefined
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
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
              multiline
            />
            <TextField
              id="outlined-basic"
              label="Ingrediente"
              variant="outlined"
              name="ingrediente"
              value={datos.ingrediente || ""} // Asegúrate de que el valor no sea undefined
              onChange={handleChange}
              error={validacion.ingrediente}
              helperText={validacion.ingrediente && "Ingrediente requerido"}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Cantidad"
              variant="outlined"
              name="cantidad"
              value={datos.cantidad}
              onChange={handleChange}
              error={validacion.cantidad}
              helperText={validacion.cantidad && "Cantidad requerida"}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Unidad de Medida"
              variant="outlined"
              name="unidad_medida"
              value={datos.unidad_medida}
              onChange={handleChange}
              error={validacion.unidad_medida}
              helperText={
                validacion.unidad_medida && "Unidad de medida requerida"
              }
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Tipo"
              variant="outlined"
              name="tipo"
              value={datos.tipo}
              onChange={handleChange}
              error={validacion.tipo}
              helperText={validacion.tipo && "Tipo requerido"}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorTexto,
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Duración"
              variant="outlined"
              name="duracion"
              value={datos.duracion}
              onChange={handleChange}
              error={validacion.duracion}
              helperText={validacion.duracion && "Duración requerida"}
              sx={{
                "& .MuiInputLabel-root": { color: colorTexto }, // Color del label
                "& .MuiOutlinedInput-root": { color: colorTexto }, // Color del texto ingresado
                "& .MuiFormHelperText-root": { color: "red" }, // Color del helper text
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

export default ModificarPaso;
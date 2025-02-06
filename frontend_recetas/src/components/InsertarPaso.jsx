import  { useState, useEffect } from "react";
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Grid, Stack, Modal } from "@mui/material";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";
import { useTema } from "./ThemeProvider";

function InsertarPaso() {
  const [datos, setDatos] = useState({
    orden: "",
    descripcion: "",
    ingrediente: "",
    cantidad: "",
    unidad_medida: "",
    tipo: "",
    duracion: "",
    receta: "", 
    necesario: "",
  });
  const [recetas, setRecetas] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { colorFondo, colorTexto } = useTema();

  useEffect(() => {
    async function fetchRecetas() {
      try {
        let response = await fetch(`${apiUrl}/receta`);
        if (response.ok) {
          let data = await response.json();
          setRecetas(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener recetas:", error);
      }
    }

    fetchRecetas();
  }, []);

  useEffect(() => {
    async function fetchPasos() {
      try {
        let response = await fetch(`${apiUrl}/pasos`);
        if (response.ok) {
          let data = await response.json();
          setPasos(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener pasos:", error);
      }
    }

    fetchPasos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const siguienteOrden = pasos.length > 0 ? Math.max(...pasos.map(paso => paso.orden)) + 1 : 1;
    const datosConOrden = {
      ...datos,
      orden: siguienteOrden,
      necesario: datos.necesario === "Sí" ? 1 : 0,
    };

    try {
      let response = await fetch(`${apiUrl}/pasos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosConOrden),
      });

      if (response.ok) {
        navigate("/pasosreceta/" + datos.receta);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.mensaje || "Error al insertar paso");
        setOpen(true);
        console.error("Error al insertar paso:", response.statusText);
      }
    } catch (error) {
      setErrorMessage("Error al insertar paso");
      setOpen(true);
      console.error("Error al insertar paso:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2, color: colorTexto }}>
        Insertar Paso
      </Typography>
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={8} lg={6}>
          <Stack component="form" onSubmit={handleSubmit} spacing={3}>
            <FormControl fullWidth required>
              <InputLabel sx={{ color: colorTexto }}>Receta</InputLabel>
              <Select
                label="Receta"
                name="receta"
                value={datos.receta}
                onChange={handleChange}
                sx={{
                  color: colorTexto,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colorTexto,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colorTexto,
                  },
                }}
              >
                {recetas.map((receta) => (
                  <MenuItem key={receta.receta_id} value={receta.receta_id}>
                    {receta.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Orden"
              name="orden"
              value={datos.orden}
              onChange={handleChange}
              fullWidth
              type="number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            <TextField
              label="Ingrediente"
              name="ingrediente"
              value={datos.ingrediente}
              onChange={handleChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            <TextField
              label="Cantidad"
              name="cantidad"
              value={datos.cantidad}
              onChange={handleChange}
              fullWidth
              type="number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            <TextField
              label="Unidad de Medida"
              name="unidad_medida"
              value={datos.unidad_medida}
              onChange={handleChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            <TextField
              label="Tipo"
              name="tipo"
              value={datos.tipo}
              onChange={handleChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            <TextField
              label="Duración (minutos)"
              name="duracion"
              value={datos.duracion}
              onChange={handleChange}
              fullWidth
              type="number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto,
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto,
                },
                "& .MuiInputBase-input": {
                  color: colorTexto,
                },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
            
            <FormControl fullWidth >
              <InputLabel sx={{ color: colorTexto }}>Necesario</InputLabel>
              <Select
                label="Necesario"
                name="necesario"
                value={datos.necesario}
                onChange={handleChange}
                sx={{
                  color: colorTexto,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colorTexto,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colorTexto,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colorTexto,
                  },
                }}
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, maxWidth: 400, margin: 'auto', marginTop: '20vh' }}>
          <Typography variant="h6" color="error">
            Error
          </Typography>
          <Typography>
            {errorMessage}
          </Typography>
          <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default InsertarPaso;
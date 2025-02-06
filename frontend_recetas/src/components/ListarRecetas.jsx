import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditNoteIcon from "@mui/icons-material/ModeEditTwoTone";
import { useNavigate } from "react-router";
import { useTema } from "./ThemeProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';

function ListaRecetas() {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el cuadro de búsqueda
  const [searchColumn, setSearchColumn] = useState("nombre"); // Estado para la columna de búsqueda
  const [startDate, setStartDate] = useState(null); // Estado para la fecha de inicio
  const [endDate, setEndDate] = useState(null); // Estado para la fecha de fin
  const navigate = useNavigate();
  const {  colorFondo, colorTexto } = useTema();

  useEffect(() => {
    async function getRecetas() {
      try {
        let response = await fetch(`${apiUrl}/receta`);
        if (response.ok) {
          let data = await response.json();
          setRows(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener recetas:", error);
      }
    }

    getRecetas();
  }, []);

  const handleDelete = async (receta_id) => {
    try {
      let response = await fetch(`${apiUrl}/receta/${receta_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((receta) => receta.receta_id !== receta_id));
      }
    } catch (error) {
      console.error("Error al eliminar receta:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setSearchQuery(""); // Reiniciar el cuadro de búsqueda al cambiar la columna
    setStartDate(null); // Reiniciar la fecha de inicio al cambiar la columna
    setEndDate(null); // Reiniciar la fecha de fin al cambiar la columna
  };

  const handleSearchDifficultyChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtrar recetas por la columna seleccionada
  const filteredRows = rows.filter((row) => {
    if (searchColumn === "fecha_creacion") {
      const rowDate = new Date(row.fecha_creacion);
      if (startDate && endDate) {
        return rowDate >= startDate && rowDate <= endDate;
      } else if (startDate) {
        return rowDate >= startDate;
      } else if (endDate) {
        return rowDate <= endDate;
      }
      return true;
    }
    return row[searchColumn].toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
        <Typography variant="h4" align="center" sx={{ mt: 2, color: colorTexto }}>
          Listado de recetas
        </Typography>

        {/* Cuadro de búsqueda */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel sx={{ color: colorTexto }}>Buscar por</InputLabel>
            <Select
              labelId="search-column-select-label"
              id="search-column-select"
              value={searchColumn}
              label="Buscar por"
              onChange={handleSearchColumnChange}
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
                "& .MuiSvgIcon-root": {
                  color: colorTexto,
                },
              }}
              inputProps={{
                style: { color: colorTexto },
              }}
            >
              <MenuItem value="nombre">Nombre</MenuItem>
              <MenuItem value="descripcion">Descripción</MenuItem>
              <MenuItem value="dificultad">Dificultad</MenuItem>
              <MenuItem value="fecha_creacion">Fecha</MenuItem>
            </Select>
          </FormControl>
          {searchColumn === "dificultad" ? (
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: colorTexto }}>Dificultad</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchQuery}
                label="Dificultad"
                onChange={handleSearchDifficultyChange}
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
                  "& .MuiSvgIcon-root": {
                    color: colorTexto,
                  },
                }}
                inputProps={{
                  style: { color: colorTexto },
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Facil">Fácil</MenuItem>
                <MenuItem value="Intermedio">Intermedio</MenuItem>
                <MenuItem value="Avanzado">Avanzado</MenuItem>
                <MenuItem value="Extremo">Extremo</MenuItem>
              </Select>
            </FormControl>
          ) : searchColumn === "fecha_creacion" ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DatePicker
                label="Fecha inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      marginRight: 2,
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
                )}
              />
              <DatePicker
                label="Fecha fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
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
                )}
              />
            </Box>
          ) : (
            <TextField
              label="Buscar recetas"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                width: "50%",
                color: colorTexto,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: colorTexto, // Color del borde
                  },
                  "&:hover fieldset": {
                    borderColor: colorTexto, // Color del borde al pasar el ratón
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorTexto, // Color del borde cuando está enfocado
                  },
                },
                "& .MuiInputLabel-root": {
                  color: colorTexto, // Color del label
                },
                "& .MuiInputBase-input": {
                  color: colorTexto, // Color del texto
                },
              }}
              InputProps={{
                style: { color: colorTexto },
              }}
              InputLabelProps={{
                style: { color: colorTexto },
              }}
            />
          )}
        </Box>

        <Box sx={{ mx: 4 }}>
          <TableContainer component={Paper} sx={{ mt: 2, backgroundColor: colorFondo }}>
            <Table sx={{ minWidth: "100%", width: "100%", borderCollapse: "collapse" }} aria-label="tabla de recetas">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>
                    PASOS
                  </TableCell>
                  <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>NOMBRE</TableCell>
                  <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>IMAGEN</TableCell>
                  <TableCell align="center" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "table-cell" } }}>
                    DESCRIPCIÓN
                  </TableCell>
                  <TableCell align="center" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "table-cell" } }}>
                    TIEMPO PREPARACIÓN
                  </TableCell>
                  <TableCell align="right" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "none", lg: "table-cell" } }}>
                    DIFICULTAD
                  </TableCell>
                  <TableCell align="right" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "none", lg: "table-cell" } }}>
                    FECHA DE CREACIÓN
                  </TableCell>
                  <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>ELIMINAR</TableCell>
                  <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>EDITAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.receta_id} sx={{ backgroundColor: colorFondo, height: "auto" }}>
                    <TableCell align="right" sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>
                    <Button variant="contained" onClick={() => navigate(`/pasosreceta/${row.receta_id}`)} color="primary">
                        Ver_Pasos<FactCheckTwoToneIcon fontSize="small"></FactCheckTwoToneIcon>
                      </Button>
                    </TableCell>
                    <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>{row.nombre}</TableCell>
                    <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>
                      <Avatar src={row.imagen} alt={row.nombre} loading="lazy" />
                    </TableCell>
                    <TableCell align="left" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "table-cell" } }}>
                      {row.descripcion}
                    </TableCell>
                    <TableCell align="left" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "table-cell" } }}>
                      {row.tiempo_preparacion} ms
                    </TableCell>
                    <TableCell align="right" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "none", lg: "table-cell" } }}>
                      {row.dificultad}
                    </TableCell>
                    <TableCell align="right" sx={{ color: colorTexto, border: 1, borderColor: colorTexto, display: { xs: "none", md: "none", lg: "table-cell" } }}>
                      {row.fecha_creacion}
                    </TableCell>
                    <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>
                      <Button variant="contained" onClick={() => handleDelete(row.receta_id)} color="error">
                        <DeleteForeverIcon fontSize="small" />
                      </Button>
                    </TableCell>
                    <TableCell sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}>
                      <Button variant="contained" onClick={() => navigate(`/modificareceta/${row.receta_id}`)}
                      color="warning">
                        <EditNoteIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default ListaRecetas;
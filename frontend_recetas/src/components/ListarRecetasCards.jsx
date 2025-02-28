import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditNoteIcon from "@mui/icons-material/ModeEditTwoTone";
import TablePagination from "@mui/material/TablePagination";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { useNavigate } from "react-router";
import { useTema } from "./ThemeProvider";
import Grid2 from "@mui/material/Grid2";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function ListaRecetas() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6); // 6 recetas por página
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el cuadro de búsqueda
  const [searchColumn, setSearchColumn] = useState("nombre"); // Estado para la columna de búsqueda
  const [startDate, setStartDate] = useState(null); // Estado para la fecha de inicio
  const [endDate, setEndDate] = useState(null); // Estado para la fecha de fin

  const navigate = useNavigate();
  const { colorFondo, colorTexto, colorIcono } = useTema();

  useEffect(() => {
    async function getRecetas() {
      let response = await fetch(apiUrl + "/receta");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }
    getRecetas();
  }, []);

  const handleDelete = async (receta_id) => {
    let response = await fetch(apiUrl + "/receta/" + receta_id, {
      method: "DELETE",
    });

    if (response.ok) {
      setRows(rows.filter((receta) => receta.receta_id !== receta_id));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reiniciar la paginación para evitar errores
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reiniciar la paginación al realizar una búsqueda
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setSearchQuery(""); // Reiniciar el cuadro de búsqueda al cambiar la columna
    setStartDate(null); // Reiniciar la fecha de inicio al cambiar la columna
    setEndDate(null); // Reiniciar la fecha de fin al cambiar la columna
    setPage(0); // Reiniciar la paginación al cambiar la columna de búsqueda
  };

  const handleSearchDifficultyChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reiniciar la paginación al realizar una búsqueda
  };

  const getAvatarColor = (dificultad) => {
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

  // Obtener recetas de la página actual
  const recetasPaginadas = filteredRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

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

        {/* Paginación */}
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Recetas por página"
          rowsPerPageOptions={[3, 8, 12, 16, 24, 48]} // Personaliza los valores aquí
          sx={{
            color: colorTexto, // Cambia el color del texto general
            "& .MuiTablePagination-toolbar": { color: colorTexto }, // Cambia el color del toolbar
            "& .MuiTablePagination-selectLabel": { color: colorTexto }, // Cambia el texto "Recetas por página"
            "& .MuiTablePagination-input": { color: colorTexto }, // Cambia el color del input de selección
            "& .MuiSelect-icon": { color: colorTexto }, // Cambia el color del icono de selección
            "& .MuiTablePagination-actions button": { color: colorTexto }, // Cambia el color de los botones de paginación
          }}
        />

        <Grid2
          container
          spacing={6}
          sx={{ mt: 2, alignItems: "center", justifyContent: "center" }}
        >
          {recetasPaginadas.map((row) => (
            <Grid2 item xs={12} sm={6} md={4} lg={3} key={row.receta_id}>
              <Card
                sx={{
                  display: "flex", // Añadido en Card para distribuir contenido en columna
                  backgroundColor: colorFondo,
                  borderRadius: 2,
                  border: `3px solid ${colorIcono}`,
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 432,
                  width: 300,
                  boxShadow: "10px 10px 20px rgba(16, 16, 16, 0.2)",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      alt={row.dificultad}
                      sx={{
                        bgcolor: getAvatarColor(row.dificultad),
                        fontSize: "0.75rem",
                        width: 56,
                        height: 56,
                      }}
                    >
                      {row.dificultad}
                    </Avatar>
                  }
                  title={row.nombre}
                  subheader={row.fecha_creacion}
                  sx={{ color: colorTexto }}
                  subheaderTypographyProps={{ sx: { color: colorTexto } }} // Aplica color al subheader
                />
                <CardMedia
                  component="img"
                  height="200"
                  image={row.imagen}
                  alt={row.nombre}
                  sx={{ maxWidth: "100%", maxHeight: "100%", color: colorTexto }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ color: colorTexto }}>
                    {row.descripcion}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 1,
                    backgroundColor: colorIcono,
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(row.receta_id)}
                  >
                    <DeleteForeverIcon fontSize="small" />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/pasosreceta/" + row.receta_id)}
                  >Ver pasos
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/modificareceta/" + row.receta_id)}
                    color="warning"
                  >
                    <EditNoteIcon fontSize="small" />
                  </Button>
                </Box>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </LocalizationProvider>
  );
}

export default ListaRecetas;
import { DataGrid } from '@mui/x-data-grid';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, Box, Button, Pagination, Stack, TableSortLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { apiUrl } from "../config";
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditNoteIcon from '@mui/icons-material/ModeEditTwoTone';
import { useNavigate } from "react-router";
import { useTema } from "./ThemeProvider"; // Asegúrate de que la ruta sea correcta

function ListarPasos() {
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState({ field: '', direction: 'asc' });
  const navigate = useNavigate();
  const {  colorFondo, colorTexto } = useTema();

  useEffect(() => {
    async function getPasos() {
      let response = await fetch(apiUrl + "/pasos");

      if (response.ok) {
        let data = await response.json();
        setRows(data.datos);
      }
    }

    getPasos();
  }, []); // Se ejecuta solo en el primer renderizado

  // Agrupa los pasos por idreceta
  const groupedRows = rows.reduce((acc, row) => {
    if (!acc[row.receta]) {
      acc[row.receta] = [];
    }
    acc[row.receta].push(row);
    return acc;
  }, {});

  const recetaIds = Object.keys(groupedRows);

  // Maneja el cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  // Maneja el cambio de ordenación
  const handleSort = (field) => {
    const isAsc = sortModel.field === field && sortModel.direction === 'asc';
    setSortModel({ field, direction: isAsc ? 'desc' : 'asc' });
    const sortedRows = [...rows].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? 1 : -1;
      if (a[field] > b[field]) return isAsc ? -1 : 1;
      return 0;
    });
    setRows(sortedRows);
  };

  // Obtiene los pasos para la página actual
  const currentRecetaId = recetaIds[page];
  const rowsToDisplay = groupedRows[currentRecetaId] || [];

  // Para eliminar primero indicamos el num del paso y despues el num de la receta
  const handleDelete = async (receta, orden) => {
    let response = await fetch(apiUrl + "/pasos/" + orden + "/" + receta, {
      method: "DELETE",
    });

    if (response.ok) {
      // Utilizando filter creo un array sin el paso borrado
      const pasosTrasBorrado = rows.filter(
        (pasos) => !(pasos.receta === receta && pasos.orden === orden)
      );
      // Establece los datos de nuevo para provocar un renderizado
      setRows(pasosTrasBorrado);
    } else {
      console.error("Error al eliminar el paso");
    }
  };

  return (
    <Box sx={{ backgroundColor: colorFondo, minHeight: "100vh", padding: 4 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2, color: colorTexto }}>
        Listado de Pasos ordenados
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Stack spacing={2}>
          <Pagination
            count={recetaIds.length}
            page={page + 1}
            onChange={handleChangePage}
            siblingCount={0}
            boundaryCount={2}
            sx={{
              "& .MuiPaginationItem-root": {
                color: colorTexto,
              },
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ mx: 4, height: 'calc(100vh - 200px)' }}> {/* Ajusta la altura del contenedor */}
        <DataGrid
          rows={rows}
          columns={[
            { field: 'receta', headerName: 'IDReceta', width: 90 },
            { field: 'orden', headerName: 'ORDEN', width: 150 },
            { field: 'descripcion', headerName: 'DESCRIPCION', width: 200 },
            { field: 'ingrediente', headerName: 'INGREDIENTE', width: 150 },
            { field: 'cantidad', headerName: 'CANTIDAD', width: 100 },
            { field: 'unidad_medida', headerName: 'UNIDAD DE MEDIDA', width: 150 },
            { field: 'tipo', headerName: 'TIPO', width: 100 },
            { field: 'duracion', headerName: 'DURACION', width: 100 },
          ]}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 50]}
          pagination
          onPageChange={(params) => setPage(params.page)}
          onPageSizeChange={(params) => setPageSize(params.pageSize)}
          getRowId={(row) => `${row.receta}-${row.orden}`} // Especifica un id único para cada fila
          sx={{ display: 'none' }} // Oculta el DataGrid
        />
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            backgroundColor: colorFondo,
            boxSizing: "border-box", // Asegura que el padding no afecte el tamaño total
            height: '100%',
          }}
        >
          <Table
            className="table table-sm"
            sx={{
              width: "100%", // Asegura que se ajuste al ancho disponible
              borderCollapse: "collapse", // Asegura que los bordes de las celdas se colapsen
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="right"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                  sortDirection={sortModel.field === 'receta' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'receta'}
                    direction={sortModel.field === 'receta' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('receta')}
                  >
                    IDReceta
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                  }}
                  sortDirection={sortModel.field === 'orden' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'orden'}
                    direction={sortModel.field === 'orden' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('orden')}
                  >
                    ORDEN
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                  }}
                  sortDirection={sortModel.field === 'descripcion' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'descripcion'}
                    direction={sortModel.field === 'descripcion' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('descripcion')}
                  >
                    DESCRIPCION
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                  sortDirection={sortModel.field === 'ingrediente' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'ingrediente'}
                    direction={sortModel.field === 'ingrediente' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('ingrediente')}
                  >
                    INGREDIENTE
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                    display: { xs: 'none', md: 'table-cell' },
                  }}
                  sortDirection={sortModel.field === 'cantidad' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'cantidad'}
                    direction={sortModel.field === 'cantidad' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('cantidad')}
                  >
                    CANTIDAD
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                    display: { xs: 'none', md: 'none', lg: 'table-cell' },
                  }}
                  sortDirection={sortModel.field === 'unidad_medida' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'unidad_medida'}
                    direction={sortModel.field === 'unidad_medida' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('unidad_medida')}
                  >
                    UNIDAD DE MEDIDA
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                    display: { xs: 'none', md: 'none', lg: 'table-cell' },
                  }}
                  sortDirection={sortModel.field === 'tipo' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'tipo'}
                    direction={sortModel.field === 'tipo' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('tipo')}
                  >
                    TIPO
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: colorTexto,
                    border: 1,
                    borderColor: colorTexto,
                    display: { xs: 'none', md: 'none', lg: 'table-cell' },
                  }}
                  sortDirection={sortModel.field === 'duracion' ? sortModel.direction : false}
                >
                  <TableSortLabel
                    active={sortModel.field === 'duracion'}
                    direction={sortModel.field === 'duracion' ? sortModel.direction : 'asc'}
                    onClick={() => handleSort('duracion')}
                  >
                    DURACION
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}
                >
                  ELIMINAR
                </TableCell>
                <TableCell
                  sx={{ color: colorTexto, border: 1, borderColor: colorTexto }}
                >
                  EDITAR
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsToDisplay.map((row) => (
                <TableRow
                  key={`${row.receta}-${row.orden}`}
                  sx={{
                    backgroundColor: colorFondo,
                    height: "auto", // Ajusta la altura de la fila
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                      display: { xs: "none", md: "table-cell" }, // Oculta en pantallas pequeñas
                    }}
                  >
                    {row.receta}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    {row.orden}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    {row.descripcion}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                      display: { xs: "none", md: "table-cell" }, // Oculta en pantallas pequeñas
                    }}
                  >
                    {row.ingrediente}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      display: { xs: "none", md: "table-cell" },
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    {row.cantidad}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                      display: { xs: "none", md: "none", lg: "table-cell" }, // Oculta en pantallas pequeñas
                    }}
                  >
                    {row.unidad_medida}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      display: { xs: "none", md: "none", lg: "table-cell" },
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    {row.tipo}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      display: { xs: "none", md: "none", lg: "table-cell" },
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    {row.duracion}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(row.receta, row.orden)}
                      color="error"
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colorTexto,
                      border: 1,
                      borderColor: colorTexto,
                      height: "100%", // Ocupa todo el alto
                      verticalAlign: "middle", // Asegura que el contenido esté centrado verticalmente
                      padding: 0, // Elimina el padding para asegurar que el contenido ocupe todo el espacio
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigate("/modificarpaso/" + row.orden + "/" + row.receta)}
                      color='warning'
                    >
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
  );
}

export default ListarPasos;
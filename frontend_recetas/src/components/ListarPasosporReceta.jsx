import { useEffect, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { apiUrl } from "../config";
import { useParams } from "react-router";
import { useTema } from "./ThemeProvider"; // Asegúrate de que la ruta sea correcta
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForeverTwoTone";
import EditNoteIcon from "@mui/icons-material/ModeEditTwoTone";
import { useNavigate } from "react-router";
import Modal from "@mui/material/Modal";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const ListarPasosproReceta = () => {
  const params = useParams();
  const receta_id = params.receta_id;
  const [rows, setRows] = useState([]);
  const [receta, setReceta] = useState({});
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("orden");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {  colorFondo, colorTexto} = useTema();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const getReceta = async () => {
      try {
        const response = await fetch(`${apiUrl}/receta/${receta_id}`);
        if (response.ok) {
          const data = await response.json();
          setReceta(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener la receta:", error);
      }
    };

    getReceta();
  }, [receta_id]);

  useEffect(() => {
    const getPasos = async () => {
      try {
        const response = await fetch(`${apiUrl}/pasos/${receta_id}`);
        if (response.ok) {
          const data = await response.json();
          setRows(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener pasos:", error);
      }
    };

    getPasos();
  }, [receta_id]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const sortedRows = [...rows].sort(
      getComparator(isAsc ? "desc" : "asc", property)
    );
    setRows(sortedRows);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.orden);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, orden) => {
    const selectedIndex = selected.indexOf(orden);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, orden);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleDelete = async (orden) => {
    try {
      let response = await fetch(
        `${apiUrl}/pasos/${orden}/${receta.receta_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((paso) => paso.orden !== orden));
        handleOpen(); // Abre el modal
      }
    } catch (error) {
      console.error("Error al eliminar paso:", error);
    }
  };

  const isSelected = (orden) => selected.indexOf(orden) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  //Aqui mostramos cada una de las filas de la tabla
  const renderRow = (row, index) => {
    const isItemSelected = isSelected(row.orden);
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.orden}
        selected={isItemSelected}
        sx={{ cursor: "pointer", bgcolor: colorFondo, color: colorTexto }}
      >
        <TableCell
          padding="checkbox"
          onClick={(event) => handleClick(event, row.orden)}
        >
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell align="right" sx={{ color: colorTexto }}>
          {row.orden}
        </TableCell>
        <TableCell align="left" sx={{ color: colorTexto }}>
          {row.descripcion}
        </TableCell>
        {!isSmallScreen && (
          <>
            <TableCell align="left" sx={{ color: colorTexto }}>
              {row.ingrediente}
            </TableCell>
            <TableCell align="right" sx={{ color: colorTexto }}>
              {row.cantidad}
            </TableCell>
            <TableCell align="left" sx={{ color: colorTexto }}>
              {row.unidad_medida}
            </TableCell>
            <TableCell align="left" sx={{ color: colorTexto }}>
              {row.tipo}
            </TableCell>
            <TableCell align="right" sx={{ color: colorTexto }}>
              {row.duracion}
            </TableCell>
          </>
        )}
        <TableCell sx={{ color: colorTexto }}>
          <Button
            variant="contained"
            onClick={() => handleDelete(row.orden)}
            color="error"
          >
            <DeleteForeverIcon fontSize="small" />
          </Button>
        </TableCell>
        <TableCell sx={{ color: colorTexto }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/modificarpaso/${row.orden}/${receta_id}`)}
            color="warning"
          >
            <EditNoteIcon fontSize="small" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: colorFondo, color: colorTexto }}>
      <Paper
        sx={{ width: "100%", mb: 2, bgcolor: colorFondo, color: colorTexto }}
      >
        <Toolbar
          sx={[
            {
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              bgcolor: colorFondo,
              color: colorTexto,
            },
            selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            },
          ]}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Pasos de la receta: {receta.nombre}
            </Typography>
          )}
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            width: "100%",
            height: 30,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(`/insertarpasoparareceta/${receta_id}`)}
          >
            Insertar paso
          </Button>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ color: colorTexto }}
            labelRowsPerPage="Cantidad de pasos por página:"
          />
        </Box>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ "aria-label": "select all rows" }}
                  />
                </TableCell>
                <TableCell
                  key="orden"
                  align="right"
                  padding="normal"
                  sortDirection={orderBy === "orden" ? order : false}
                  sx={{ color: colorTexto }}
                >
                  <TableSortLabel
                    active={orderBy === "orden"}
                    direction={orderBy === "orden" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "orden")}
                    sx={{ color: colorTexto }}
                  >
                    ORDEN
                    {orderBy === "orden" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="descripcion"
                  align="left"
                  padding="normal"
                  sortDirection={orderBy === "descripcion" ? order : false}
                  sx={{ color: colorTexto }}
                >
                  <TableSortLabel
                    active={orderBy === "descripcion"}
                    direction={orderBy === "descripcion" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "descripcion")}
                    sx={{ color: colorTexto }}
                  >
                    DESCRIPCION
                    {orderBy === "descripcion" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell
                      key="ingrediente"
                      align="left"
                      padding="normal"
                      sortDirection={orderBy === "ingrediente" ? order : false}
                      sx={{ color: colorTexto }}
                    >
                      <TableSortLabel
                        active={orderBy === "ingrediente"}
                        direction={orderBy === "ingrediente" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "ingrediente")
                        }
                        sx={{ color: colorTexto }}
                      >
                        INGREDIENTE
                        {orderBy === "ingrediente" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="cantidad"
                      align="right"
                      padding="normal"
                      sortDirection={orderBy === "cantidad" ? order : false}
                      sx={{ color: colorTexto }}
                    >
                      <TableSortLabel
                        active={orderBy === "cantidad"}
                        direction={orderBy === "cantidad" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "cantidad")
                        }
                        sx={{ color: colorTexto }}
                      >
                        CANTIDAD
                        {orderBy === "cantidad" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="unidad_medida"
                      align="left"
                      padding="normal"
                      sortDirection={
                        orderBy === "unidad_medida" ? order : false
                      }
                      sx={{ color: colorTexto }}
                    >
                      <TableSortLabel
                        active={orderBy === "unidad_medida"}
                        direction={orderBy === "unidad_medida" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "unidad_medida")
                        }
                        sx={{ color: colorTexto }}
                      >
                        UNIDAD DE MEDIDA
                        {orderBy === "unidad_medida" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="tipo"
                      align="left"
                      padding="normal"
                      sortDirection={orderBy === "tipo" ? order : false}
                      sx={{ color: colorTexto }}
                    >
                      <TableSortLabel
                        active={orderBy === "tipo"}
                        direction={orderBy === "tipo" ? order : "asc"}
                        onClick={(event) => handleRequestSort(event, "tipo")}
                        sx={{ color: colorTexto }}
                      >
                        TIPO
                        {orderBy === "tipo" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      key="duracion"
                      align="right"
                      padding="normal"
                      sortDirection={orderBy === "duracion" ? order : false}
                      sx={{ color: colorTexto }}
                    >
                      <TableSortLabel
                        active={orderBy === "duracion"}
                        direction={orderBy === "duracion" ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, "duracion")
                        }
                        sx={{ color: colorTexto }}
                      >
                        DURACION
                        {orderBy === "duracion" ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  </>
                )}
                <TableCell
                  key="eliminar"
                  align="center"
                  padding="normal"
                  sx={{ color: colorTexto }}
                >
                  ELIMINAR
                </TableCell>
                <TableCell
                  key="editar"
                  align="center"
                  padding="normal"
                  sx={{ color: colorTexto }}
                >
                  EDITAR
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => renderRow(row, index))}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Comprimir tabla"
        sx={{ color: colorTexto }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminado con éxito
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            El paso ha sido eliminado correctamente.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default ListarPasosproReceta;

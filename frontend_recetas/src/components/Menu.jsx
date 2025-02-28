import { useState } from "react";
import { Outlet } from "react-router";
import { Box, IconButton, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LightModeIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeIcon from '@mui/icons-material/DarkModeTwoTone';
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/restaurant-logo-sin-fondo.png";
import { useTema } from "./ThemeProvider";
import { MDBNavbarBrand } from "mdb-react-ui-kit";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router";
import IconListarRecetas from '@mui/icons-material/ListAlt';
import IconListarRecetasCards from '@mui/icons-material/SpaceDashboard';
import IconInsertarReceta from '@mui/icons-material/AddCircleOutline';
import FormatListNumberedTwoToneIcon from '@mui/icons-material/FormatListNumberedTwoTone';
import PlaylistAddCircleTwoToneIcon from '@mui/icons-material/PlaylistAddCircleTwoTone';
import { MDBFooter } from 'mdb-react-ui-kit';

function MenuApp() {
  const { temaOscuro, colorFondo, colorTexto, colorIcono, toggleTema } =
    useTema();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const list = (
    <Box
      sx={{
        width: open ? 300 : 80,
        backgroundColor: colorFondo,
        height: "100vh",
        borderRight: `3px solid ${colorIcono}`, // Aplica el borde solo a la derecha
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <Typography
          variant="h6"
          sx={{
            color: colorTexto,
            padding: 2,
            display: open ? "block" : "none",
          }}
        >
          Recetas
        </Typography>

        <ListItem disablePadding>
          <ListItemButton
            sx={{ paddingLeft: open ? 5 : 2 }}
            component={Link}
            to="/insertareceta"
            onClick={(e) => e.stopPropagation()}
          >
            <IconInsertarReceta sx={{ color: colorIcono }} />
            <ListItemText
              primary="Insertar nueva receta"
              sx={{ color: colorTexto, display: open ? "block" : "none" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{ paddingLeft: open ? 5 : 2 }}
            component={Link}
            to="/listarecetas"
            onClick={(e) => e.stopPropagation()}
          >
            <IconListarRecetas sx={{ color: colorIcono }} />
            <ListItemText
              primary="Ver todas las recetas"
              sx={{ color: colorTexto, display: open ? "block" : "none" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{ paddingLeft: open ? 5 : 2 }}
            component={Link}
            to="/listarecetascards"
            onClick={(e) => e.stopPropagation()}
          >
            <IconListarRecetasCards sx={{ color: colorIcono }} />
            <ListItemText
              primary="Ver todas las recetas(CARDS)"
              sx={{ color: colorTexto, display: open ? "block" : "none" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <hr
        className=""
        style={{
          backgroundColor: colorFondo === "#FFFFFF" ? "#ffa600" : "#FFFFFF",
          border:
            colorFondo === "#FFFFFF"
              ? `3px solid ${colorIcono}`
              : "3px solid #FFFFFF",
        }}
      />
      <List>
        <Typography
          variant="h6"
          sx={{
            color: colorTexto,
            padding: 2,
            display: open ? "block" : "none",
          }}
        >
          Pasos
        </Typography>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{ paddingLeft: open ? 5 : 2 }}
            component={Link}
            to="/listarpasos"
            onClick={(e) => e.stopPropagation()}
          >
            <FormatListNumberedTwoToneIcon sx={{ color: colorIcono }} />
            <ListItemText
              primary="Listar Pasos"
              sx={{ color: colorTexto, display: open ? "block" : "none" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ paddingLeft: open ? 5 : 2 }}
            component={Link}
            to="/insertarpaso"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaylistAddCircleTwoToneIcon sx={{ color: colorIcono }} />
            <ListItemText
              primary="Insertar Paso"
              sx={{ color: colorTexto, display: open ? "block" : "none" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ paddingLeft: open ? 5 : 2 }}
            component={Link}
            to="/graficapasos"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaylistAddCircleTwoToneIcon sx={{ color: colorIcono }} />
            <ListItemText
              primary="Grafica Pasos"
              sx={{ color: colorTexto, display: open ? "block" : "none" }}
            />
          </ListItemButton>
        </ListItem>



      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: colorFondo,
          padding: 2,
          borderBottom: `4px solid ${colorIcono}`,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <div>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(!open)}
              >
                <MenuIcon sx={{ color: colorIcono }} />
              </IconButton>
            </div>
            <MDBNavbarBrand href="/" className="ms-3">
              <img
                src={logo}
                height="80"
                alt="logo"
                loading="lazy"
                className="me-2"
              />
              <Typography variant="h3" className="" sx={{ color: colorTexto }}>
                Recetario
              </Typography>
            </MDBNavbarBrand>
          </Box>
          {/* Boton para cambiar el tema claro y oscuro */}
          <IconButton
            onClick={toggleTema}
            size="large"
            sx={{ transition: "transform 0.5s ease-in-out" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease-in-out",
                transform: temaOscuro ? "rotate(360deg)" : "rotate(0deg)",
              }}
            >
              {temaOscuro ? (
                <DarkModeIcon sx={{ color: "#FFFFFF", fontSize: 28 }} />
              ) : (
                <LightModeIcon sx={{ color: `${colorIcono}`, fontSize: 28 }} />
              )}
            </Box>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* este es el menu lateral solo iconos */}
      <Box sx={{ display: "flex", flex: 1 }}>
        <Drawer
          anchor="left"
          open={open}
          onClose={toggleDrawer(false)}
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: open ? 300 : 80,
              top: 115.5, // Asegura que el Drawer se quede en la parte superior

              transition: "width 0.3s",
              position: "fixed", // Aquí agregamos 'position: fixed' para que sea fija
            },
          }}
        >
          {list}
        </Drawer>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            marginTop: "100px",
            marginLeft: open ? "300px" : "80px",
            backgroundColor: colorFondo,
          }}
        >
          <Outlet />
          
        </Box>
      </Box>
      <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2025 Copyright:
        <a className='text-reset fw-bold' >
          AngelGallegoZayas.SA
        </a>
      </div>
    </MDBFooter>
    </Box>
  );
}

export default MenuApp;

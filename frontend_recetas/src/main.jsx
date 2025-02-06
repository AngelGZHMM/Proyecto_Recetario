import { StrictMode } from "react";
import { createRoot } from "react-dom/client";


import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import PaginaError from "./pages/PaginaError";
import ListarRecetas from "./components/ListarRecetas";
import ModificarReceta from "./components/ModificarReceta";
import ListarRecetasCards from "./components/ListarRecetasCards";
import InsertarReceta from "./components/InsertarReceta";
import ListarPasos from "./components/ListarPasos";
import ListarPasosproReceta from "./components/ListarPasosporReceta";
import InsertarPaso from "./components/InsertarPaso";
import InsertarPasoparaReceta from "./components/InsertarPasoparaReceta";
import ModificarPaso from "./components/ModificarPaso";
import Inicio from "./components/Inicio";


let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PaginaError/>,

    children: [
      {
        path:"/",
        element:<Inicio/>
      },
      {
        path: "listarecetas",
        element: <ListarRecetas />,
      },
      {
        path: "listarecetascards",
        element: <ListarRecetasCards />,
      },
      {
        path: "modificareceta/:receta_id",
        element: <ModificarReceta />,
      },
      {
        path: "modificarpaso/:orden/:receta_id",
        element: <ModificarPaso />,
      },
      {
        path: "insertareceta",
        element: <InsertarReceta />,
      },
      {
        path: "listarpasos",
        element: <ListarPasos />,
      },
      {
        path: "pasosreceta/:receta_id",
        element: <ListarPasosproReceta/>,
      },
      {
        path: "insertarpaso",
        element: <InsertarPaso/>,
      },
      {
        path: "insertarpasoparareceta/:receta_id",
        element: <InsertarPasoparaReceta/>,
      },
      // hacer un apartado con Collapsible table
      // poner los insert de fecha bien

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

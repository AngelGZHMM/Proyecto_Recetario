import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderCollapse: "collapse", // Colapsar los bordes de la tabla
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "14.28%", // Ajustar el ancho de las columnas
    borderStyle: "solid",
    borderWidth: 1,
    borderCollapse: "collapse", // Colapsar los bordes de la tabla
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

/**
 * ListarPasosporRecetaPDF component - Generates a PDF document listing the steps of a recipe.
 * @param {Object} props - The component props.
 * @param {Array} props.data - The data for the steps of the recipe.
 * @param {Object} props.receta - The recipe details.
 * @returns {JSX.Element} The rendered PDF document.
 */
const ListarPasosporRecetaPDF = ({ data, receta }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Pasos de la Receta: {receta.nombre}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Orden</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Descripción</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Ingrediente</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Cantidad</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Unidad de Medida</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Tipo</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Duración</Text>
            </View>
          </View>
          {data.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.orden}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.descripcion}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.ingrediente}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.cantidad}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.unidad_medida}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.tipo}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.duracion}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default ListarPasosporRecetaPDF;
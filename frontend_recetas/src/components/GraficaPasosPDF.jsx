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
    width: "50%", // Ajustar el ancho de las columnas
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

const GraficaPasosPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Número de Pasos por Receta</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Receta</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Número de Pasos</Text>
            </View>
          </View>
          {data.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.receta}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.numpasos}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default GraficaPasosPDF;
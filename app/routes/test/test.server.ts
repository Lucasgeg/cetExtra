import { Document, Text, Image, Page, StyleSheet } from "@react-pdf/renderer";

export const myStyles = async () => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });
  return styles;
};

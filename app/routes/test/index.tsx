import {
  Page,
  Text,
  Document,
  View,
  renderToStream,
} from "@react-pdf/renderer";

// rajoute les champs dynamiques pour ton PDF
type PdfProps = {
  name: string;
};

const PdfDocument: React.FC<PdfProps> = ({ name }) => {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>{name}</Text>
        </View>
      </Page>
    </Document>
  );
};

export const generatePdf = async (props: PdfProps) =>
  await renderToStream(<PdfDocument {...props} />);

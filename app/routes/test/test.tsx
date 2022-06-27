import { Document, Page, Text } from "@react-pdf/renderer";

import React from "react";

const Test = () => {
  return (
    <Document>
      <Page>
        <Text>React-Pdf</Text>
      </Page>
    </Document>
  );
};

export default Test;

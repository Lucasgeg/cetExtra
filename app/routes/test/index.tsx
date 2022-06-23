import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCurrentUser } from "~/utils/newAuth.server";
import {
  Document,
  Text,
  Image,
  Page,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { myStyles } from "./test.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  const userMail = user.email;
  const missionId = "62b1c051d9392460ade2b740";
  const styles = await myStyles();
  const myDoc = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );

  return json({ userMail, missionId, styles });
};

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userMail, missionId } = useLoaderData();
  return (
    <div className="">
      <h1>toto</h1>
    </div>
  );
};

export default index;

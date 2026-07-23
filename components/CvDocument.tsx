import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvEntry } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#111111" },
  title: { fontSize: 20, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 11, color: "#555555", marginBottom: 20 },
  entry: { marginBottom: 16 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  role: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  dates: { fontSize: 10, color: "#555555" },
  org: { fontSize: 11, marginBottom: 4, color: "#333333" },
  summary: { marginBottom: 4, lineHeight: 1.4 },
  highlight: { marginLeft: 10, marginBottom: 2, lineHeight: 1.4 },
});

function formatMonth(value: string | null): string {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CvDocument({ entries }: { entries: CvEntry[] }) {
  return (
    <Document title="Epy — CV">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Epy</Text>
        <Text style={styles.subtitle}>Software Engineer</Text>

        {entries.map((entry) => (
          <View key={`${entry.organization}-${entry.start_date}`} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <Text style={styles.role}>{entry.role}</Text>
              <Text style={styles.dates}>
                {formatMonth(entry.start_date)} - {formatMonth(entry.end_date)}
              </Text>
            </View>
            <Text style={styles.org}>{entry.organization}</Text>
            <Text style={styles.summary}>{entry.summary}</Text>
            {entry.highlights.map((highlight) => (
              <Text key={highlight} style={styles.highlight}>
                • {highlight}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}

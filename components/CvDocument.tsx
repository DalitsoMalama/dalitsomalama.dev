import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Certification, CvEntry, EducationEntry, Profile, SkillGroup } from "@/lib/types";

// react-pdf hyphenates long words by default ("program-ming"); a CV reads
// better with whole words wrapped to the next line.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, fontFamily: "Helvetica", color: "#111111" },
  title: { fontSize: 20, marginBottom: 2, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 11, color: "#555555", marginBottom: 6 },
  contact: { fontSize: 9.5, color: "#555555", marginBottom: 18 },
  link: { color: "#555555", textDecoration: "none" },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#555555",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 6,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
  },
  entry: { marginBottom: 12 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  role: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  dates: { fontSize: 9.5, color: "#555555" },
  org: { fontSize: 10.5, marginBottom: 3, color: "#333333" },
  summary: { marginBottom: 3 },
  highlight: { marginLeft: 10, marginBottom: 2 },
  row: { flexDirection: "row", marginBottom: 4 },
  rowLabel: { width: 160, paddingRight: 10, fontFamily: "Helvetica-Bold" },
  rowValue: { flex: 1 },
  muted: { color: "#555555" },
});

function formatMonth(value: string | null): string {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CvDocument({
  profile,
  entries,
  skills,
  education,
  certifications,
}: {
  profile: Profile;
  entries: CvEntry[];
  skills: SkillGroup[];
  education: EducationEntry[];
  certifications: Certification[];
}) {
  const links = [profile.linkedin_url, profile.github_url].filter((url): url is string => Boolean(url));

  return (
    <Document title={`${profile.name} — CV`} author={profile.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{profile.name}</Text>
        <Text style={styles.subtitle}>{profile.headline}</Text>
        <Text style={styles.contact}>
          {profile.location} · {profile.email}
          {links.map((url) => (
            <Text key={url}>
              {" · "}
              <Link src={url} style={styles.link}>
                {url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </Link>
            </Text>
          ))}
        </Text>

        <Text style={styles.sectionTitle}>Experience</Text>
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

        {skills.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((group) => (
              <View key={group.group} style={styles.row}>
                <Text style={styles.rowLabel}>{group.group}</Text>
                <Text style={styles.rowValue}>{group.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((item) => (
              <View key={item.qualification} style={styles.row}>
                <Text style={styles.rowLabel}>{item.year ?? ""}</Text>
                <Text style={styles.rowValue}>
                  {item.qualification}, {item.institution}
                  {item.note && <Text style={styles.muted}> ({item.note})</Text>}
                </Text>
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={`${cert.issuer}-${cert.name}`} style={styles.row}>
                <Text style={styles.rowLabel}>{cert.year ?? ""}</Text>
                <Text style={styles.rowValue}>
                  {cert.name}, {cert.issuer}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View wrap={false}>
          <Text style={styles.sectionTitle}>Referees</Text>
          <Text>Available on request.</Text>
        </View>
      </Page>
    </Document>
  );
}

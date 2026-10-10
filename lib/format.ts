/** Short display names for organisations whose full names don't fit chips and card labels. */
export function shortOrganization(org: string): string {
  return org
    .replace("Nkana Water Supply and Sanitation Company", "Nkana Water")
    .replace(", Directorate of ICT", "");
}

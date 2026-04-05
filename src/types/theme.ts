export interface CVTheme {
  id: string;
  label: string;
  description: string;

  // Layout
  headerBg: string;
  sidebarBg: string;
  mainBg: string;

  // Text
  headerText: string;
  headerSubText: string;     // availability / subtitle
  sidebarText: string;
  sidebarMuted: string;
  mainText: string;
  mainMuted: string;         // periods, secondary info

  // Accents
  accent: string;            // borders, bullets
  accentLight: string;       // section dividers

  // Borders
  borderColor: string;

  // Section headings
  sectionHeadingText: string;
  sectionHeadingBorder: string;

  // Intro italic block
  introText: string;
  introBg: string;
}

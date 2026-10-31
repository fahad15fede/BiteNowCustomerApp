import { MenuItem } from "../types";

export type MenuSection = { title: string; data: MenuItem[] };

/** Flat list → sections for SectionList (keeps the order categories first appear in). */
export function groupMenuByCategory(items: MenuItem[]): MenuSection[] {
  const sections: MenuSection[] = [];

  for (const item of items) {
    let section = sections.find((s) => s.title === item.category);
    if (!section) {
      section = { title: item.category, data: [] };
      sections.push(section);
    }
    section.data.push(item);
  }

  return sections;
}
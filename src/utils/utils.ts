const meses: Record<string, string> = {
  "Jan.": "01",
  "Fev.": "02",
  "Mar.": "03",
  "Abr.": "04",
  "Mai.": "05",
  "Jun.": "06",
  "Jul.": "07",
  "Ago.": "08",
  "Set.": "09",
  "Out.": "10",
  "Nov.": "11",
  "Dez.": "12",
};

export function parseData(dateStr: string): string {
  const [dia, mesAbrev] = dateStr.replace(".", "").split(" ");
  const mes = meses[mesAbrev + "."] || "01";
  const ano = new Date().getFullYear();
  return `${ano}-${mes}-${dia.padStart(2, "0")}`;
}
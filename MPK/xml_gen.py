import os
from datetime import datetime

# Adres Twojej strony
BASE_URL = "https://adakanuwu.github.io/MPK"

# Katalog z plikami HTML (zmień na swoją ścieżkę)
HTML_DIR = r"C:\Users\adams\Desktop\Foldery\Strona\Aktualne Projekty\NOWA strona MPK Częstochowa — GitHub (base href bez domeny)\MPK"

# Nazwa pliku wyjściowego
OUTPUT_FILE = "sitemap.xml"

# Foldery, które chcemy pominąć
IGNORE_FOLDERS = ["admin", "test"]

urls = []

for root, dirs, files in os.walk(HTML_DIR):
    # Pomijamy niechciane foldery
    dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]

    for file in files:
        if file.endswith(".html"):
            # Ścieżka względna
            rel_path = os.path.relpath(os.path.join(root, file), HTML_DIR)
            # Zamiana backslash → slash i usunięcie rozszerzenia .html
            url_path = rel_path.replace(os.sep, '/').replace('.html', '')
            url = f"{BASE_URL}/{url_path}"
            # Zapisujemy również pełną ścieżkę do pliku, żeby pobrać lastmod
            urls.append((url, os.path.join(root, file)))

# Tworzymy sitemap.xml
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

    for url, filepath in urls:
        # Pobieramy czas ostatniej modyfikacji pliku
        lastmod_ts = os.path.getmtime(filepath)
        lastmod = datetime.fromtimestamp(lastmod_ts).date()  # YYYY-MM-DD

        f.write("  <url>\n")
        f.write(f"    <loc>{url}</loc>\n")
        f.write(f"    <lastmod>{lastmod}</lastmod>\n")
        f.write("    <changefreq>monthly</changefreq>\n")
        f.write("    <priority>0.8</priority>\n")
        f.write("  </url>\n")

    f.write("</urlset>\n")

print(f"Sitemap wygenerowana: {OUTPUT_FILE}")

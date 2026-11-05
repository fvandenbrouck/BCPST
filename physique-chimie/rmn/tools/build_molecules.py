#!/usr/bin/env python3
"""
Génère les formules topologiques (chemfig/LaTeX) en SVG statiques pour le
module RMN du proton. Même principe que chimie-organique/tools/build_molecules.py :
le code source chemfig de chaque molécule est versionné et vérifiable,
l'application elle-même ne fait qu'afficher les SVG pré-générés.

Usage : python3 tools/build_molecules.py

Les atomes porteurs de couleur (balises \\color{rust|moss|ochre|slate}) gardent
leur couleur fixe dans le SVG (ce sont les couleurs de groupes de protons
équivalents) ; le reste du dessin (squelette, atomes non colorés) est en noir
pur et converti en `currentColor` pour suivre le thème du site.
"""
import json, os, re, subprocess, sys, tempfile, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "tools", "molecules.json")
OUT_DIR = os.path.join(ROOT, "assets", "mol")

PREAMBLE = r"""\documentclass[border=3pt]{standalone}
\usepackage[version=4]{mhchem}
\usepackage{chemfig}
\usepackage{preview}
\usepackage{xcolor}
\definecolor{rust}{HTML}{A6512B}
\definecolor{moss}{HTML}{5F6F42}
\definecolor{ochre}{HTML}{C89B3C}
\definecolor{slate}{HTML}{4C5B66}
\setchemfig{atom sep=2.3em, bond style={line width=0.9pt}, double bond sep=2.2pt}
\begin{document}
"""

def main():
    with open(MANIFEST, encoding="utf-8") as f:
        molecules = json.load(f)
    ids = [m["id"] for m in molecules]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        sys.exit("IDs en double dans molecules.json : " + ", ".join(sorted(dupes)))

    workdir = tempfile.mkdtemp(prefix="rmn-mol-")
    tex_path = os.path.join(workdir, "batch.tex")
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(PREAMBLE)
        for m in molecules:
            f.write("\\begin{preview}\\chemfig{%s}\\end{preview}\n" % m["chemfig"])
        f.write("\\end{document}\n")

    print(f"Compilation LaTeX de {len(molecules)} molécules...")
    r = subprocess.run(
        ["pdflatex", "-interaction=nonstopmode", "-halt-on-error", "batch.tex"],
        cwd=workdir, capture_output=True, text=True
    )
    if r.returncode != 0:
        print(r.stdout[-4000:])
        sys.exit("Échec de la compilation LaTeX (voir ci-dessus).")

    pdf_path = os.path.join(workdir, "batch.pdf")
    os.makedirs(OUT_DIR, exist_ok=True)
    failed = []
    for i, m in enumerate(molecules, start=1):
        svg_path = os.path.join(workdir, f"p{i}.svg")
        r = subprocess.run(
            ["pdftocairo", "-svg", "-f", str(i), "-l", str(i), pdf_path, svg_path],
            capture_output=True, text=True
        )
        if r.returncode != 0 or not os.path.exists(svg_path):
            failed.append(m["id"])
            continue
        with open(svg_path, encoding="utf-8") as f:
            svg = f.read()
        svg = re.sub(r"rgb\(0%,\s*0%,\s*0%\)", "currentColor", svg)
        dest = os.path.join(OUT_DIR, f"{m['id']}.svg")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(svg)

    shutil.rmtree(workdir, ignore_errors=True)
    if failed:
        sys.exit("Échec pour les molécules : " + ", ".join(failed))
    print(f"OK — {len(molecules)} fichiers SVG écrits dans {OUT_DIR}")

if __name__ == "__main__":
    main()

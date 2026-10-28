#!/usr/bin/env python3
"""
Génère les formules topologiques (chemfig/LaTeX) en SVG statiques.

Usage :
    python3 tools/build_molecules.py

Lit tools/molecules.json (liste de {"id": ..., "chemfig": ...}), compile une
seule fois un document LaTeX (une molécule par page, via chemfig/TikZ), puis
découpe chaque page en un fichier SVG indépendant dans assets/mol/<id>.svg.
Les couleurs sont remplacées par `currentColor` pour s'adapter au thème
clair/sombre du site (cf. css/chimorg.css, règle `.mol-figure svg`).

Prérequis (machine de développement uniquement — rien n'est exécuté côté
utilisateur final, le site reste 100% statique) : une distribution LaTeX avec
le paquet chemfig (TeX Live / MacTeX), et poppler (pdftocairo).

Pour ajouter une molécule : ajoute une entrée dans molecules.json avec son
"id" (utilisé comme nom de fichier) et son code chemfig, puis relance ce
script. Voir chimie-organique/CONTRIBUTING.md pour la syntaxe chemfig.
"""
import json, os, re, subprocess, sys, tempfile, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "tools", "molecules.json")
OUT_DIR = os.path.join(ROOT, "assets", "mol")

PREAMBLE = r"""\documentclass[border=3pt]{standalone}
\usepackage[version=4]{mhchem}
\usepackage{chemfig}
\usepackage{preview}
\usetikzlibrary{calc,positioning,shapes.geometric,decorations.pathreplacing}
\setchemfig{atom sep=2.1em, bond style={line width=0.9pt}, double bond sep=2.2pt}
\begin{document}
"""

def body_of(m):
    """Chaque entrée du manifeste est soit {"chemfig": "..."} (formule
    topologique), soit {"tikz": "..."} (schéma simplifié en TikZ brut, pour
    les représentations non-structurales comme les boîtes Base/Pentose/
    Phosphate)."""
    if "chemfig" in m:
        return "\\chemfig{%s}" % m["chemfig"]
    if "tikz" in m:
        return "\\begin{tikzpicture}%s\\end{tikzpicture}" % m["tikz"]
    raise ValueError("molecule %r has neither 'chemfig' nor 'tikz'" % m.get("id"))

def main():
    with open(MANIFEST, encoding="utf-8") as f:
        molecules = json.load(f)
    ids = [m["id"] for m in molecules]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        sys.exit("IDs en double dans molecules.json : " + ", ".join(sorted(dupes)))

    workdir = tempfile.mkdtemp(prefix="chimorg-mol-")
    tex_path = os.path.join(workdir, "batch.tex")
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(PREAMBLE)
        for m in molecules:
            f.write("\\begin{preview}%s\\end{preview}\n" % body_of(m))
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

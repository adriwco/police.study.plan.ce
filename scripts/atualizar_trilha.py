import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAMINHO_TRILHA = os.path.join(RAIZ, "aulas", "trilha.json")

PASTAS = {
    "00": "00-comece-aqui", "01": "01-alfabetizacao-juridica", "02": "02-matematica",
    "03": "03-raciocinio-logico", "04": "04-portugues", "05": "05-informatica",
    "06": "06-constitucional", "07": "07-administrativo", "08": "08-penal-geral",
    "09": "09-penal-especial", "10": "10-processo-penal", "11": "11-legislacao-especial",
    "12": "12-legislacao-estadual", "13": "13-criminologia", "14": "14-medicina-legal",
    "15": "15-contabilidade", "16": "16-estatistica", "17": "17-redacao", "18": "18-reta-final",
}

trilha = json.load(open(CAMINHO_TRILHA, encoding="utf-8"))
prontas = 0
total = 0
for modulo in trilha["modulos"]:
    pasta = modulo.get("pasta") or PASTAS[modulo["id"]]
    modulo["pasta"] = pasta
    diretorio = os.path.join(RAIZ, "aulas", pasta)
    arquivos = sorted(os.listdir(diretorio)) if os.path.isdir(diretorio) else []
    for numero, aula in enumerate(modulo["aulas"], 1):
        encontrado = next((a for a in arquivos if a.startswith(f"{numero:02d}-") and a.endswith(".md")), None)
        aula["arquivo"] = f"aulas/{pasta}/{encontrado}" if encontrado else None
        total += 1
        prontas += 1 if encontrado else 0

json.dump(trilha, open(CAMINHO_TRILHA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
sys.stdout.write(f"{prontas}/{total} aulas prontas\n")

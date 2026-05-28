"""
Seed script untuk import data dari tws.json ke MongoDB.

Cara pakai (dari folder `backend`, venv aktif):
    python -m scripts.seed
"""
import json
from pathlib import Path

from app.database import tws_collection

# tws.json berada di root project (satu level di atas folder backend/)
JSON_PATH = Path(__file__).resolve().parents[2] / "tws.json"


def main() -> None:
    if not JSON_PATH.exists():
        raise FileNotFoundError(f"File tidak ditemukan: {JSON_PATH}")

    with JSON_PATH.open(encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("tws.json harus berupa array of objects.")

    deleted = tws_collection.delete_many({}).deleted_count
    result = tws_collection.insert_many(data)

    print(f"Dihapus  : {deleted} dokumen lama")
    print(f"Diinsert : {len(result.inserted_ids)} dokumen baru")
    print(f"Total kini: {tws_collection.count_documents({})} dokumen")


if __name__ == "__main__":
    main()

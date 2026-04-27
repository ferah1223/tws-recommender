from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import math

from app.database import tws_collection
from app.models import UserPreferenceModel, TWSModel

app = FastAPI(title="TWS Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend TWS Recommendation API is running"}


@app.get("/tws")
def get_all_tws():
    data = []
    for item in tws_collection.find():
        item["_id"] = str(item["_id"])
        data.append(item)
    return {"total_data": len(data), "products": data}


@app.get("/tws/{product_id}")
def get_tws_by_id(product_id: str):
    try:
        product = tws_collection.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Format ID tidak valid.")
    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")
    product["_id"] = str(product["_id"])
    return product


@app.post("/tws")
def add_tws(product: TWSModel):
    product_dict = product.model_dump()
    existing_product = tws_collection.find_one({
        "nama": product_dict["nama"],
        "brand": product_dict["brand"]
    })
    if existing_product:
        raise HTTPException(status_code=400, detail="Produk dengan nama dan brand tersebut sudah ada.")
    result = tws_collection.insert_one(product_dict)
    return {
        "message": "Produk berhasil ditambahkan",
        "inserted_id": str(result.inserted_id),
        "product": product_dict
    }


@app.put("/tws/{product_id}")
def update_tws(product_id: str, product: TWSModel):
    try:
        existing_product = tws_collection.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Format ID tidak valid.")
    if not existing_product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")
    product_dict = product.model_dump()
    duplicate_product = tws_collection.find_one({
        "nama": product_dict["nama"],
        "brand": product_dict["brand"],
        "_id": {"$ne": ObjectId(product_id)}
    })
    if duplicate_product:
        raise HTTPException(status_code=400, detail="Produk lain dengan nama dan brand tersebut sudah ada.")
    tws_collection.update_one({"_id": ObjectId(product_id)}, {"$set": product_dict})
    updated_product = tws_collection.find_one({"_id": ObjectId(product_id)})
    updated_product["_id"] = str(updated_product["_id"])
    return {"message": "Produk berhasil diperbarui", "product": updated_product}


@app.delete("/tws/{product_id}")
def delete_tws(product_id: str):
    try:
        result = tws_collection.delete_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Format ID tidak valid.")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan.")
    return {"message": "Produk berhasil dihapus", "deleted_id": product_id}


# ─────────────────────────────────────────────
#  ENCODING: Atribut → Vektor
# ─────────────────────────────────────────────

# [DIPERBAIKI] One-Hot Encoding untuk karakter suara.
#
# Sebelumnya menggunakan ordinal encoding (bass=0, balance=1, treble=2)
# yang secara implisit mengasumsikan hubungan jarak numerik antar kategori —
# seolah-olah bass "lebih dekat" ke balance daripada ke treble.
# Padahal ketiganya adalah kategori yang sepenuhnya berbeda (nominal),
# bukan skala bertingkat.
#
# One-Hot Encoding merepresentasikan setiap kategori sebagai dimensi
# vektor tersendiri sehingga cosine similarity tidak bias akibat
# urutan angka yang tidak bermakna.
#
# Dimensi: [is_bass, is_balance, is_treble]
SUARA_ONE_HOT: dict[str, list[float]] = {
    "bass":    [1.0, 0.0, 0.0],
    "balance": [0.0, 1.0, 0.0],
    "treble":  [0.0, 0.0, 1.0],
}

# Bobot per kelompok fitur.
# Karakter suara diberi bobot 2x karena merupakan preferensi inti
# yang paling menentukan kepuasan audio pengguna berdasarkan literatur
# sistem rekomendasi produk audio.
# ANC dan gaming masing-masing diberi bobot 1 sebagai fitur pendukung
# yang bersifat fungsional.
#
# Catatan: baterai tidak lagi masuk vektor similarity karena sudah
# ditangani sebagai hard constraint (filter keras) sebelum scoring —
# lihat bagian filter di endpoint /recommend.
WEIGHTS: dict[str, float] = {
    "suara":  2.0,
    "anc":    1.0,
    "gaming": 1.0,
}


def _build_vector(
    suara: str,
    anc: bool,
    gaming: bool,
) -> list[float]:
    """
    Mengubah atribut produk atau preferensi pengguna menjadi vektor numerik
    berbobot yang siap dihitung cosine similarity-nya.

    [DIPERBAIKI] Vektor sekarang terdiri dari 5 dimensi:
      [0] is_bass    : 1.0 jika karakter suara bass,    else 0.0  (× W_suara)
      [1] is_balance : 1.0 jika karakter suara balance, else 0.0  (× W_suara)
      [2] is_treble  : 1.0 jika karakter suara treble,  else 0.0  (× W_suara)
      [3] anc        : 1.0 jika True, 0.0 jika False               (× W_anc)
      [4] gaming     : 1.0 jika True, 0.0 jika False               (× W_gaming)

    Baterai dihapus dari vektor karena difilter sebagai hard constraint
    sebelum cosine similarity dihitung, sehingga semantiknya tidak lagi
    ambigu antara nilai "minimal" (preferensi) dan nilai "aktual" (produk).
    """
    suara_vec = [v * WEIGHTS["suara"] for v in SUARA_ONE_HOT.get(suara, [0.0, 0.0, 0.0])]
    return [
        *suara_vec,
        (1.0 if anc else 0.0) * WEIGHTS["anc"],
        (1.0 if gaming else 0.0) * WEIGHTS["gaming"],
    ]


# ─────────────────────────────────────────────
#  HELPER: Cosine Similarity
# ─────────────────────────────────────────────

def _cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """
    Menghitung cosine similarity antara dua vektor.

    Rumus:
        cos(θ) = (A · B) / (|A| × |B|)

    Nilai hasil: 0.0 (tidak mirip sama sekali) hingga 1.0 (identik).

    Jika salah satu vektor bernilai nol semua (zero vector), fungsi
    mengembalikan 0.0 untuk menghindari pembagian dengan nol.
    """
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a ** 2 for a in vec_a))
    magnitude_b = math.sqrt(sum(b ** 2 for b in vec_b))

    if magnitude_a == 0.0 or magnitude_b == 0.0:
        return 0.0

    return dot_product / (magnitude_a * magnitude_b)


# ─────────────────────────────────────────────
#  HELPER: CBF scoring engine
# ─────────────────────────────────────────────

def _compute_score(
    product: dict,
    preference: UserPreferenceModel,
    user_vector: list[float],
) -> tuple[float, int, list[str]]:
    """
    Menghitung skor CBF menggunakan Cosine Similarity antara
    vektor preferensi pengguna dan vektor atribut produk.

    Skor akhir dinormalisasi ke rentang 0–100 dengan mengalikan
    nilai cosine similarity (0–1) dengan 100.

    Parameter:
        product      : dokumen produk dari MongoDB
        preference   : preferensi pengguna dari request body
        user_vector  : vektor preferensi yang sudah dihitung sebelumnya
                       (di-cache di endpoint untuk efisiensi)

    Return:
        (cosine_raw, display_score, alasan)
        - cosine_raw   : nilai cosine 0.0–1.0, digunakan untuk sorting
        - display_score: skor bulat 0–100 untuk ditampilkan ke pengguna
        - alasan       : daftar string penjelasan kesesuaian
    """
    product_vector = _build_vector(
        suara=product["karakter_suara"],
        anc=bool(product["anc"]),
        gaming=bool(product["gaming"]),
    )

    cosine_raw = _cosine_similarity(user_vector, product_vector)
    display_score = round(cosine_raw * 100)

    # Alasan kesesuaian (untuk transparansi rekomendasi).
    # Dihasilkan dari perbandingan langsung atribut agar lebih mudah
    # dipahami pengguna dibanding menampilkan nilai cosine mentah.
    alasan: list[str] = []

    if product["karakter_suara"] == preference.karakter_suara:
        alasan.append(f"Karakter suara sesuai preferensi ({preference.karakter_suara})")
    elif product["karakter_suara"] == "balance":
        alasan.append("Karakter suara balance (mendekati preferensimu)")
    else:
        alasan.append(
            f"Karakter suara {product['karakter_suara']} "
            f"(berbeda dari preferensimu: {preference.karakter_suara})"
        )

    # [DIPERBAIKI] Alasan baterai tetap ditampilkan untuk transparansi,
    # meskipun filter baterai sudah dilakukan sebagai hard constraint
    # sebelum scoring — sehingga semua kandidat di sini sudah pasti memenuhi.
    alasan.append(
        f"Baterai {product['battery_hours']} jam memenuhi kebutuhan minimal "
        f"{preference.min_battery_hours} jam"
    )

    if preference.anc and product["anc"]:
        alasan.append("Memiliki fitur ANC sesuai kebutuhanmu")
    elif preference.anc and not product["anc"]:
        alasan.append("Tidak memiliki ANC (kamu menginginkan ANC)")

    if preference.gaming and product["gaming"]:
        alasan.append("Mendukung mode gaming (latensi rendah)")
    elif preference.gaming and not product["gaming"]:
        alasan.append("Tidak mendukung mode gaming")

    return cosine_raw, display_score, alasan


# ─────────────────────────────────────────────
#  ENDPOINT: Rekomendasi
# ─────────────────────────────────────────────

@app.post("/recommend")
def recommend_tws(preference: UserPreferenceModel, top_n: int = 3):
    """
    Endpoint rekomendasi TWS menggunakan metode Content-Based Filtering (CBF)
    dengan perhitungan kemiripan menggunakan Cosine Similarity.

    Alur:
      1. Filter keras (hard constraint): produk di atas budget dan di bawah
         kebutuhan baterai minimal langsung dibuang karena keduanya adalah
         batasan mutlak yang tidak bisa dikompromikan.
      2. Bangun vektor preferensi pengguna (dihitung sekali, dipakai ulang).
      3. Hitung cosine similarity antara vektor user dan vektor tiap produk.
      4. Urutkan produk dari skor tertinggi dan kembalikan top_n terbaik.

    Fitur yang masuk vektor CBF (soft preference — dinilai by similarity):
      - Karakter suara (one-hot: bass / balance / treble)
      - ANC (boolean)
      - Gaming mode (boolean)

    Fitur yang menjadi hard constraint (filter keras, tidak masuk vektor):
      - Budget (harga produk ≤ budget user)
      - Baterai (battery_hours produk ≥ min_battery_hours user)
    """
    products = list(tws_collection.find())

    if not products:
        return {
            "total_ditemukan": 0,
            "total_ditampilkan": 0,
            "recommendations": [],
            "pesan": "Belum ada produk di database."
        }

    # Bangun vektor user sekali di sini, bukan berulang di dalam loop
    user_vector = _build_vector(
        suara=preference.karakter_suara,
        anc=preference.anc,
        gaming=preference.gaming,
    )

    candidates = []

    for product in products:
        # ── Hard Constraint 1: Budget ──────────────────────────────────────
        # Produk di atas budget langsung dibuang — budget adalah batasan
        # mutlak yang tidak bisa dikompromikan oleh nilai similarity.
        if product["harga"] > preference.budget:
            continue

        # ── Hard Constraint 2: Baterai ────────────────────────────────────
        # [DIPERBAIKI] Baterai kini difilter sebagai hard constraint,
        # bukan dimasukkan ke dalam vektor similarity.
        #
        # Alasan: user menyatakan min_battery_hours sebagai kebutuhan minimum
        # (bukan preferensi ideal), sehingga semantiknya berbeda dari
        # vektor produk yang menggunakan nilai aktual battery_hours.
        # Memasukkan keduanya ke dalam cosine similarity akan menghasilkan
        # perbandingan yang tidak setara (minimum vs aktual).
        #
        # Dengan memfilter di sini, vektor similarity hanya membandingkan
        # fitur-fitur yang benar-benar bersifat preferensial (suara, ANC, gaming).
        if product["battery_hours"] < preference.min_battery_hours:
            continue

        cosine_raw, display_score, alasan = _compute_score(
            product, preference, user_vector
        )

        candidates.append({
            "id": str(product["_id"]),
            "nama": product["nama"],
            "brand": product["brand"],
            "harga": product["harga"],
            "image_url": product.get("image_url"),
            "skor": display_score,
            "_cosine_raw": cosine_raw,  # untuk sorting internal, tidak dikirim ke client
            "alasan": alasan,
            "spesifikasi": {
                "karakter_suara": product["karakter_suara"],
                "battery_hours": product["battery_hours"],
                "anc": product["anc"],
                "gaming": product["gaming"],
                "bluetooth_version": product.get("bluetooth_version"),
                "codec": product.get("codec"),
                "water_resistance": product.get("water_resistance"),
                "driver_size": product.get("driver_size"),
                "mic_count": product.get("mic_count"),
                "charging_port": product.get("charging_port"),
                "deskripsi": product.get("deskripsi"),
            },
        })

    if not candidates:
        return {
            "total_ditemukan": 0,
            "total_ditampilkan": 0,
            "recommendations": [],
            "pesan": (
                f"Tidak ada produk yang sesuai dengan budget Rp{preference.budget:,} "
                f"dan kebutuhan baterai minimal {preference.min_battery_hours} jam."
            )
        }

    # Sort by cosine_raw (presisi float), bukan display_score yang sudah dibulatkan
    candidates.sort(key=lambda x: x["_cosine_raw"], reverse=True)

    # Hapus _cosine_raw sebelum dikirim ke client
    top_recommendations = []
    for item in candidates[:top_n]:
        item.pop("_cosine_raw", None)
        top_recommendations.append(item)

    return {
        "total_ditemukan": len(candidates),
        "total_ditampilkan": len(top_recommendations),
        "recommendations": top_recommendations,
    }

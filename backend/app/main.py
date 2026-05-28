from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import math

from app.database import tws_collection
from app.models import UserPreferenceModel, TWSModel


# ─────────────────────────────────────────────
#  TABEL KETAHANAN AIR (IP Rating)
# ─────────────────────────────────────────────
#
# Rating IP itu standar internasional yang menunjukkan seberapa tahan suatu
# perangkat terhadap debu dan air, contohnya IPX4, IP55, IP68.
#
# Cara baca:
#   - Angka/huruf pertama  = ketahanan debu (X = tidak diuji)
#   - Angka kedua          = ketahanan air (semakin tinggi semakin tahan)
#
# Untuk TWS, yang relevan adalah angka kedua (ketahanan air). Tabel di bawah
# mengubah string rating menjadi angka biar mudah dibandingkan (misal:
# "apakah produk dengan IPX5 lebih tahan dari kebutuhan minimum IPX4?").
WATER_HIERARCHY: dict[str, int] = {
    "IPX2": 2,
    "IPX3": 3,
    "IPX4": 4,
    "IPX5": 5,
    "IPX6": 6,
    "IPX7": 7,
    "IP54": 4,  # tahan percikan ringan (setara IPX4)
    "IP55": 5,  # tahan semprotan air (setara IPX5)
    "IP56": 6,
    "IP57": 7,
    "IP67": 7,
    "IP68": 8,  # paling tahan air, bisa direndam
}

# Tabel ini menerjemahkan pilihan user di form ("none" / "basic" / "sport")
# menjadi angka minimal yang harus dipenuhi rating produk.
#
# Misal: kalau user pilih "sport", produk harus minimal punya rating dengan
# nilai 5 ke atas (IPX5, IP55, IP67, dst).
WATER_MIN_THRESHOLD: dict[str, int] = {
    "none":  0,   # user tidak peduli — tidak ada filter ketahanan air
    "basic": 4,   # anti keringat ringan / percikan air
    "sport": 5,   # untuk olahraga / aktivitas outdoor
}

# ─────────────────────────────────────────────
#  DAFTAR HI-RES AUDIO
# ─────────────────────────────────────────────
#
# Codec audio dibagi 2 tingkat kualitas:
#   - Standar : SBC, AAC — lossy biasa, default Bluetooth
#   - Hi-Res Audio : LDAC, LHDC, aptX (semua varian), LC3, SSC, L2HC
#               — bitrate lebih tinggi / kompresi lebih baik / lossless
#
# Daftar di bawah berisi kata kunci. Sebuah produk dianggap Hi-Res Audio kalau
# field codec-nya mengandung MINIMAL SATU dari kata kunci ini
# (case-insensitive). Misal codec "SBC, AAC, LDAC" → Hi-Res Audio karena ada LDAC.
HIRES_CODEC_KEYWORDS: tuple[str, ...] = (
    "LDAC",
    "LHDC",
    "aptX",   # mencakup aptX, aptX HD, aptX Adaptive, aptX Lossless
    "LC3",
    "SSC",    # mencakup SSC, SSC Hi-Fi
    "L2HC",
)


def _is_hires_codec(codec_str: str | None) -> bool:
    """
    Cek apakah string codec produk mengandung salah satu codec Hi-Res Audio.
    Pencocokan tidak peduli huruf besar/kecil. Kalau codec_str kosong
    atau None, dianggap bukan Hi-Res Audio.
    """
    if not codec_str:
        return False
    codec_upper = codec_str.upper()
    return any(kw.upper() in codec_upper for kw in HIRES_CODEC_KEYWORDS)

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
#  MENGUBAH KARAKTER SUARA JADI ANGKA
# ─────────────────────────────────────────────
#
# Komputer tidak bisa membandingkan teks "bass", "balance", "treble"
# secara langsung. Kita harus mengubahnya jadi angka dulu.
#
# Karakter suara dibagi 3 tingkat frekuensi:
#   - bass    : suara rendah dominan (low)
#   - balance : seimbang (mengandung low, mid, dan high)
#   - treble  : suara tinggi dominan (high)
#
# Setiap karakter dijabarkan jadi 3 angka [low, mid, high] yang menunjukkan
# seberapa kuat tiap rentang frekuensi:
#
#   bass     = [1.0, 0.5, 0.0]   → low kuat, mid sedang, high tidak ada
#   balance  = [0.5, 1.0, 0.5]   → semua rentang ada porsinya
#   treble   = [0.0, 0.5, 1.0]   → high kuat, mid sedang, low tidak ada
#
# Kenapa begini? Supaya sistem paham bahwa bass dan balance "agak mirip"
# (sama-sama punya unsur low), sedangkan bass dan treble "jauh berbeda".
# Kalau kita pakai cara sederhana misalnya bass=[1,0,0], balance=[0,1,0],
# treble=[0,0,1], maka jarak ketiganya sama persis — padahal di telinga
# manusia, bass dan balance lebih berdekatan dari pada bass dan treble.
SUARA_VEC: dict[str, list[float]] = {
    "bass":    [1.0, 0.5, 0.0],
    "balance": [0.5, 1.0, 0.5],
    "treble":  [0.0, 0.5, 1.0],
}

# Bobot tiap fitur saat dihitung kemiripan.
#
# Karakter suara diberi bobot 2x (dua kali lipat dari ANC, gaming, dan codec)
# karena:
#
#   1) Skripsi ini fokus pada "preferensi suara pengguna" sebagai faktor
#      utama. Maka wajar kalau karakter suara lebih berpengaruh ke skor
#      dibanding fitur pendukung lainnya.
#
#   2) Membuat porsi adil. Karakter suara terdiri dari 3 angka [low, mid,
#      high], sedangkan ANC, gaming, dan codec masing-masing cuma 1 angka
#      (Ya/Tidak). Tanpa bobot tambahan, fitur boolean bisa terlalu dominan.
#
# Catatan: angka 2.0 dipilih berdasarkan pertimbangan, bukan hasil eksperimen.
# Riset lanjutan bisa mencari bobot terbaik dari feedback pengguna.
WEIGHTS: dict[str, float] = {
    "suara":  2.0,
    "anc":    1.0,
    "gaming": 1.0,
    "hires":  1.0,
}


def _build_vector(
    suara: str,
    anc: bool,
    gaming: bool,
    hires: bool,
) -> list[float]:
    """
    Mengubah atribut produk atau preferensi pengguna menjadi deretan angka
    (vektor) yang siap dibandingkan dengan rumus kemiripan.

    Hasilnya berisi 6 angka:
      [0..2] : tiga angka untuk karakter suara [low, mid, high]
      [3]    : ANC          (1 = ada,        0 = tidak)
      [4]    : gaming mode  (1 = mendukung,  0 = tidak)
      [5]    : Hi-Res Audio (1 = mendukung,  0 = tidak)

    Tiga angka pertama dikalikan bobot suara (lihat WEIGHTS) supaya
    karakter suara lebih berpengaruh ke skor akhir.

    Catatan tentang dimensi Hi-Res Audio:
        Nilai user diambil dari input preferensi Hi-Res Audio di form.
        Untuk produk, nilai hires diambil dari deteksi otomatis field codec
        di database.

    Baterai dan ketahanan air TIDAK dimasukkan ke vektor karena sudah
    dipakai sebagai filter keras sebelum perhitungan kemiripan — lihat
    bagian /recommend.
    """
    suara_vec = [v * WEIGHTS["suara"] for v in SUARA_VEC.get(suara, [0.0, 0.0, 0.0])]
    return [
        *suara_vec,
        (1.0 if anc else 0.0) * WEIGHTS["anc"],
        (1.0 if gaming else 0.0) * WEIGHTS["gaming"],
        (1.0 if hires else 0.0) * WEIGHTS["hires"],
    ]


# ─────────────────────────────────────────────
#  RUMUS KEMIRIPAN (Cosine Similarity)
# ─────────────────────────────────────────────

def _cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """
    Menghitung tingkat kemiripan antara dua deretan angka (vektor)
    menggunakan rumus cosine similarity.

    Cara kerjanya: bayangkan dua vektor sebagai dua panah. Cosine similarity
    mengukur sudut di antara keduanya:
      - 1.0 = sudutnya 0° (panah menunjuk arah yang sama persis = mirip)
      - 0.0 = sudutnya 90° (tidak ada kesamaan)

    Rumus matematis:
        cos(θ) = (A · B) / (|A| × |B|)
      yaitu: hasil kali tiap pasangan angka dijumlahkan, lalu dibagi
      panjang masing-masing vektor.

    Edge case: kalau salah satu vektor berisi nol semua, dianggap 0.0
    supaya tidak terjadi pembagian dengan nol.
    """
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a ** 2 for a in vec_a))
    magnitude_b = math.sqrt(sum(b ** 2 for b in vec_b))

    if magnitude_a == 0.0 or magnitude_b == 0.0:
        return 0.0

    return dot_product / (magnitude_a * magnitude_b)


# ─────────────────────────────────────────────
#  PENGHITUNG SKOR PER PRODUK
# ─────────────────────────────────────────────

def _compute_score(
    product: dict,
    preference: UserPreferenceModel,
    user_vector: list[float],
) -> tuple[float, int, list[str]]:
    """
    Menghitung seberapa cocok satu produk dengan preferensi pengguna.

    Skor cocok dihitung dengan cosine similarity (0.0 - 1.0), lalu
    dikalikan 100 untuk ditampilkan ke user (jadi 0 - 100).

    Parameter:
        product      : data produk dari MongoDB
        preference   : preferensi user yang dikirim dari form
        user_vector  : vektor preferensi user yang sudah dihitung sekali
                       di endpoint, dipakai ulang biar lebih efisien

    Return:
        (cosine_raw, display_score, alasan)
        - cosine_raw   : skor mentah 0.0 - 1.0 (dipakai untuk pengurutan)
        - display_score: skor 0 - 100 untuk ditampilkan ke user
        - alasan       : daftar kalimat penjelasan kenapa produk ini cocok
    """
    # Penanganan netral untuk ANC dan gaming:
    #
    # Saat user pilih "Tidak" di form (anc=False atau gaming=False), itu
    # diartikan sebagai "tidak butuh fitur tersebut", BUKAN "aktif menolak".
    # Karena itu, produk yang punya fitur tersebut tidak boleh dihukum
    # skornya — fitur itu cukup dianggap sebagai bonus yang netral.
    #
    # Trik implementasinya: kalau user tidak butuh, paksa nilai produk
    # untuk dimensi itu jadi 0. Karena vektor user juga 0 di dimensi
    # tersebut, dimensi ini tidak akan mempengaruhi cosine similarity
    # sama sekali (tidak menambah/mengurangi skor produk apapun).
    #
    # Untuk Hi-Res Audio, preferensi user menentukan apakah dimensi ini
    # ikut memengaruhi skor. Produk yang mendukung Hi-Res Audio mendapat
    # kontribusi positif saat user memilih Ya di form.
    product_hires = _is_hires_codec(product.get("codec"))
    product_vector = _build_vector(
        suara=product["karakter_suara"],
        anc=preference.anc and bool(product["anc"]),
        gaming=preference.gaming and bool(product["gaming"]),
        hires=preference.hires and product_hires,
    )

    cosine_raw = _cosine_similarity(user_vector, product_vector)
    display_score = round(cosine_raw * 100)

    # Alasan kesesuaian dibuat dengan kalimat yang mudah dimengerti user.
    # Lebih ramah daripada menampilkan angka cosine mentah.
    alasan: list[str] = []

    if product["karakter_suara"] == preference.karakter_suara:
        alasan.append(f"Karakter suara sesuai preferensi ({preference.karakter_suara})")
    elif product["karakter_suara"] == "balance" or preference.karakter_suara == "balance":
        alasan.append(
            f"Karakter suara {product['karakter_suara']} "
            f"(berdekatan dengan preferensimu: {preference.karakter_suara})"
        )
    else:
        alasan.append(
            f"Karakter suara {product['karakter_suara']} "
            f"(berseberangan dari preferensimu: {preference.karakter_suara})"
        )

    # Baterai sudah disaring di tahap awal (semua kandidat pasti memenuhi),
    # tapi alasannya tetap ditampilkan supaya user tahu produknya lolos.
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

    # Hi-Res Audio hanya ditampilkan kalau produk memang mendukung.
    # Kalau tidak punya, jangan tampilkan alasan negatif supaya tidak
    # membingungkan user awam yang tidak paham soal codec.
    if product_hires:
        alasan.append(
            f"Mendukung Hi-Res Audio ({product.get('codec', '-')}) untuk kualitas audio lebih baik"
        )

    # Ketahanan air: alasannya cuma ditampilkan kalau user memang minta
    # (basic/sport). Sama seperti baterai, ini sudah disaring di awal.
    if preference.water_resistance != "none":
        pref_label = {
            "basic": "anti keringat ringan (IPX4+)",
            "sport": "olahraga / outdoor (IPX5 atau IP54+)",
        }.get(preference.water_resistance, preference.water_resistance)
        alasan.append(
            f"Rating {product.get('water_resistance', '-')} "
            f"memenuhi kebutuhan {pref_label}"
        )

    return cosine_raw, display_score, alasan


# ─────────────────────────────────────────────
#  ENDPOINT: Rekomendasi
# ─────────────────────────────────────────────

@app.post("/recommend")
def recommend_tws(preference: UserPreferenceModel, top_n: int = 3):
    """
    Endpoint utama rekomendasi TWS.

    Metode yang dipakai: Content-Based Filtering (CBF) dengan rumus cosine
    similarity. Singkatnya: bandingkan preferensi user dengan tiap produk,
    lalu urutkan dari yang paling cocok.

    Alur kerjanya:
      1. Saring dulu produk pakai "filter keras" — yang melanggar budget,
         baterai minimal, atau ketahanan air langsung dibuang.
      2. Bangun vektor preferensi user (dihitung sekali di awal).
      3. Untuk tiap produk yang lolos, hitung kemiripannya dengan vektor user.
      4. Urutkan dari skor tertinggi, ambil top_n teratas.

    Pembagian fitur:

    Fitur yang dipakai untuk menghitung kemiripan ("soft preference"):
      - Karakter suara (fuzzy: low / mid / high)  — dari input user
      - ANC (Ya/Tidak)                            — dari input user
      - Gaming mode (Ya/Tidak)                    — dari input user
      - Hi-Res Audio (Ya/Tidak)                   — dari input user

    Fitur yang dipakai sebagai filter keras ("hard constraint"):
      - Budget (harga produk harus ≤ budget user)
      - Baterai (jam baterai produk harus ≥ kebutuhan minimal user)
      - Ketahanan air (rating IP produk harus ≥ ambang yang user pilih)
    """
    products = list(tws_collection.find())

    if not products:
        return {
            "total_ditemukan": 0,
            "total_ditampilkan": 0,
            "recommendations": [],
            "pesan": "Belum ada produk di database."
        }

    # Hitung vektor user sekali saja di sini, supaya tidak diulang-ulang
    # untuk setiap produk di dalam loop (lebih efisien).
    #
    # Catatan dimensi Hi-Res Audio: nilai user diambil dari input form.
    # Kalau user memilih Ya, produk dengan Hi-Res Audio mendapat kecocokan
    # lebih tinggi dibanding produk tanpa Hi-Res Audio.
    user_vector = _build_vector(
        suara=preference.karakter_suara,
        anc=preference.anc,
        gaming=preference.gaming,
        hires=preference.hires,
    )

    candidates = []

    for product in products:
        # ── Filter 1: Budget ──────────────────────────────────────────────
        # Produk yang lebih mahal dari budget user langsung dibuang.
        # Budget itu batasan mutlak — tidak bisa dikompromikan dengan skor.
        if product["harga"] > preference.budget:
            continue

        # ── Filter 2: Baterai ─────────────────────────────────────────────
        # Baterai dipakai sebagai filter keras (bukan dimasukkan ke vektor)
        # karena artinya beda:
        #   - User input "baterai minimal X jam" (kebutuhan minimum)
        #   - Produk punya "baterai aktual Y jam" (nilai sebenarnya)
        #
        # Kalau dipaksakan masuk vektor, dua angka yang artinya beda akan
        # dibandingkan langsung — hasilnya tidak bermakna. Lebih jelas
        # kalau langsung: produk dengan baterai < kebutuhan = buang.
        if product["battery_hours"] < preference.min_battery_hours:
            continue

        # ── Filter 3: Ketahanan Air ───────────────────────────────────────
        # Sama logikanya dengan baterai. User pilih "basic" atau "sport"
        # sebagai kebutuhan minimum, lalu produk yang ratingnya di bawah
        # ambang akan dibuang.
        #
        # Cara kerjanya:
        #   1. Ambil angka ambang dari WATER_MIN_THRESHOLD (basic = 4, dst).
        #   2. Ambil angka rating produk dari WATER_HIERARCHY.
        #   3. Kalau produk < ambang, buang.
        required_level = WATER_MIN_THRESHOLD.get(
            preference.water_resistance, 0
        )
        if required_level > 0:
            product_level = WATER_HIERARCHY.get(
                product.get("water_resistance", ""), 0
            )
            if product_level < required_level:
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
            "_cosine_raw": cosine_raw,  # dipakai untuk pengurutan, tidak dikirim ke frontend
            "alasan": alasan,
            "spesifikasi": {
                "karakter_suara": product["karakter_suara"],
                "battery_hours": product["battery_hours"],
                "anc": product["anc"],
                "gaming": product["gaming"],
                "bluetooth_version": product.get("bluetooth_version"),
                "codec": product.get("codec"),
                "is_hires": _is_hires_codec(product.get("codec")),
                "water_resistance": product.get("water_resistance"),
                "driver_size": product.get("driver_size"),
                "mic_count": product.get("mic_count"),
                "charging_port": product.get("charging_port"),
                "deskripsi": product.get("deskripsi"),
            },
        })

    if not candidates:
        constraint_parts = [
            f"budget Rp{preference.budget:,}",
            f"baterai minimal {preference.min_battery_hours} jam",
        ]
        if preference.water_resistance != "none":
            water_label = {
                "basic": "rating anti keringat (IPX4+)",
                "sport": "rating olahraga (IPX5 atau IP54+)",
            }.get(preference.water_resistance, preference.water_resistance)
            constraint_parts.append(water_label)

        return {
            "total_ditemukan": 0,
            "total_ditampilkan": 0,
            "recommendations": [],
            "pesan": (
                "Tidak ada produk yang sesuai dengan "
                + ", ".join(constraint_parts) + "."
            )
        }

    # Urutkan kandidat dari skor tertinggi.
    #
    # Catatan: kita pakai cosine_raw (angka asli 0.0-1.0) untuk pengurutan,
    # BUKAN display_score yang sudah dibulatkan jadi 0-100. Kalau pakai
    # yang dibulatkan, banyak produk akan terlihat seri padahal sebenarnya
    # ada selisih kecil di angka mentahnya.
    #
    # Penyelesaian seri (tie-breaker):
    #   Cosine similarity sering menghasilkan angka yang sama persis karena
    #   fitur yang dibandingkan jumlahnya sedikit (cuma 3 fitur kategorikal).
    #   Saat dua produk seri, kita pilih yang harganya PALING DEKAT dengan
    #   budget user.
    #
    # Alasannya:
    #   Budget yang user input bukan cuma batas maksimum — itu juga sinyal
    #   "kemampuan dan kemauan bayar". Di pasar TWS, biasanya harga lebih
    #   tinggi = kualitas lebih bagus (driver lebih besar, Hi-Res Audio,
    #   ANC lebih efektif). Jadi di antara produk yang sama-sama cocok
    #   secara preferensi, sistem memilih yang paling memaksimalkan budget
    #   user — bukan yang termurah meriah.
    candidates.sort(
        key=lambda x: (-x["_cosine_raw"], abs(preference.budget - x["harga"]))
    )

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

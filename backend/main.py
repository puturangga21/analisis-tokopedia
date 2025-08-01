from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Koneksi MongoDB ---
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
COLLECTION_NAME = os.getenv('COLLECTION_NAME')

try:
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    df = pd.DataFrame(list(collection.find({})))
    print(f"✅ Terkoneksi ke MongoDB: Database '{DATABASE_NAME}', Collection '{COLLECTION_NAME}'")
except Exception as e:
    print(f"[ERROR] Gagal terkoneksi ke MongoDB: {e}")
    df = pd.DataFrame([])

# --- Persiapan Data ---
if not df.empty:
    df['diskon_rupiah'] = df['original price'] - df['price']

# --- ENDPOINT 1: Produk dengan Diskon Tertinggi ---
@app.route('/list-subcategory', methods=['GET'])
def list_subcategory():
    # Filter hanya produk yang memiliki diskon valid
    df_diskon = df[df['original price'] > df['price']].copy()

    # Hitung jumlah produk per subkategori
    subcat_counts = df_diskon['subcategory'].value_counts()

    # Ambil subkategori yang memiliki lebih dari 1 produk
    subcats_valid = subcat_counts[subcat_counts > 1].index.tolist()
    subcats_valid.sort()

    return jsonify(subcats_valid)

@app.route('/diskon-tertinggi', methods=['GET'])
def diskon_tertinggi():
    subcategory = request.args.get('subcategory')
    df_diskon = df[df['diskon_rupiah'] > 0].copy()

    if subcategory:
        df_diskon = df_diskon[df_diskon['subcategory'] == subcategory]

    top = df_diskon.sort_values(by='diskon_rupiah', ascending=False).head(10).reset_index(drop=True)
    hasil = top[['title', 'diskon_rupiah', 'discount', 'delivery']].to_dict(orient='records')
    return jsonify(hasil)



# --- ENDPOINT 2: 10 Lokasi dengan Jumlah Barang Terbanyak ---
@app.route('/lokasi-terbanyak', methods=['GET'])
def lokasi_terbanyak():
    hasil = []

    # Hitung total stock per lokasi
    lokasi_stock = df.groupby('delivery')['stock'].sum().sort_values(ascending=False).head(10)

    for lokasi, jumlah in lokasi_stock.items():
        df_lokasi = df[df['delivery'] == lokasi]
        subcats = df_lokasi['subcategory'].value_counts().to_dict()

        hasil.append({
            'delivery': lokasi,
            'jumlah': int(jumlah),
            'jumlah_subkategori': len(subcats),
            'subkategori': subcats
        })

    return jsonify(hasil)


# --- ENDPOINT 3: Perbandingan Harga Asli vs Harga Diskon ---
@app.route('/perbandingan-harga', methods=['GET'])
def perbandingan_harga():
    subcategory = request.args.get('subcategory')
    df['diskon_rupiah'] = df['original price'] - df['price']
    filtered = df[df['diskon_rupiah'] > 0]

    if subcategory:
        filtered = filtered[filtered['subcategory'] == subcategory]

    top = filtered.sort_values(by='original price', ascending=False).head(10)
    hasil = top[['title', 'price', 'original price', 'discount', 'delivery']].to_dict(orient='records')
    return jsonify(hasil)


# --- ENDPOINT 4: Produk Sama di Lokasi Berbeda ---
@app.route('/produk-multi-lokasi', methods=['GET'])
def produk_multi_lokasi():
    title_location_counts = df.groupby('title')['delivery'].nunique().reset_index()
    judul_berbeda_lokasi = title_location_counts[title_location_counts['delivery'] > 1]
    return jsonify(judul_berbeda_lokasi['title'].tolist())

@app.route('/produk-perbandingan', methods=['GET'])
def produk_perbandingan_lokasi():
    judul_produk = request.args.get('judul')
    if not judul_produk:
        return jsonify({'error': 'Judul produk tidak diberikan'}), 400

    df_filtered = df[df['title'] == judul_produk].copy()

    if df_filtered.empty:
        return jsonify({'error': 'Produk tidak ditemukan'}), 404

    df_filtered['diskon_rupiah'] = df_filtered['original price'] - df_filtered['price']
    hasil = df_filtered[['delivery', 'original price', 'price', 'diskon_rupiah', 'discount']]
    return jsonify(hasil.to_dict(orient='records'))

# --- Run Flask App ---
if __name__ == '__main__':
    app.run(debug=True) 

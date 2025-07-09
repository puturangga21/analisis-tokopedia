import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import DiskonTerbesar from './components/analisis/DiskonTerbesar';
import LokasiTerbanyak from './components/analisis/LokasiTerbanyak';
import PerbandinganHarga from './components/analisis/PerbandinganHarga';
import PerbandinganLokasiProduk from './components/analisis/PerbandinganLokasiProduk';

const jenisAnalisis = {
  1: 'Analisis Produk Dengan Diskon Tertinggi',
  2: '10 Lokasi dengan Jumlah Barang Terbanyak',
  3: 'Perbandingan Harga Asli vs Harga Diskon',
  4: 'Perbandingan Produk yang Sama di Lokasi Berbeda',
};

function App() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [produkList, setProdukList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [data, setData] = useState([]);

  const handleSelectAnalysis = async (value) => {
    setSelectedAnalysis(value);
    setData([]);
    setSelectedProduct('');
    if (value === '4') {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/produk-multi-lokasi');
        setProdukList(res.data);
      } catch (err) {
        console.error('Gagal memuat daftar produk:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnalisis = async () => {
    if (selectedAnalysis === '1') {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/diskon-tertinggi');
        setData(res.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedAnalysis === '2') {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/lokasi-terbanyak');
        setData(res.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedAnalysis === '3') {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/perbandingan-harga');
        setData(res.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedAnalysis === '4' && selectedProduct) {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/produk-perbandingan/${selectedProduct}`
        );
        setData(res.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main>
      <header className="flex flex-col items-center justify-center h-64 gap-2">
        <h1 className="uppercase font-extrabold text-4xl bg-gradient-to-b from-blue-800 to-cyan-400 bg-clip-text text-transparent">
          Analisis Produk Tokopedia
        </h1>

        <p className="text-lg text-muted-foreground font-medium">
          {jenisAnalisis[selectedAnalysis] || 'Silakan pilih jenis analisis'}
        </p>

        {selectedAnalysis === '4' && (
          <p className="text-sm text-muted-foreground">
            {selectedProduct || 'Pilih produk untuk analisis'}
          </p>
        )}

        <div className="flex gap-4 mt-8 items-end">
          <div className="flex flex-col text-sm gap-1 ">
            <p>Jenis Analisis</p>
            <Select onValueChange={(value) => handleSelectAnalysis(value)}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Pilih Analisis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Produk Dengan Diskon Tertinggi</SelectItem>
                <SelectItem value="2">
                  10 Lokasi dengan Jumlah Barang Terbanyak
                </SelectItem>
                <SelectItem value="3">Perbandingan Harga Asli vs Harga Diskon</SelectItem>
                <SelectItem value="4">Bandingkan Produk Berbeda Lokasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col text-sm gap-1 ">
            {selectedAnalysis === '4' && (
              <div className="flex flex-col text-sm gap-1">
                <p>Pilih Produk</p>
                <Select onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Pilih Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {produkList.map((item, idx) => (
                      <SelectItem key={idx} value={item}>
                        {item.length > 60 ? item.slice(0, 60) + '...' : item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button className="cursor-pointer" onClick={handleAnalisis}>
            Analisis
          </Button>
        </div>
      </header>

      <Separator />

      {loading && <p className="text-center mt-4">🔄 Memuat data...</p>}

      {/* UI TAMPILAN ANALISIS */}
      {selectedAnalysis === '1' && data.length > 0 && <DiskonTerbesar data={data} />}
      {selectedAnalysis === '2' && data.length > 0 && <LokasiTerbanyak data={data} />}
      {selectedAnalysis === '3' && data.length > 0 && <PerbandinganHarga data={data} />}
      {selectedAnalysis === '4' && data.length > 0 && (
        <PerbandinganLokasiProduk data={data} />
      )}
    </main>
  );
}

export default App;

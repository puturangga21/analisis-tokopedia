import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
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
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const [produkList, setProdukList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const [loading, setLoading] = useState(false);
  const [produkOpen, setProdukOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);

  const handleSelectAnalysis = async (value) => {
    setSelectedAnalysis(value);
    setData([]);
    setSelectedProduct('');

    if (value === '1') {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://analisis-produk-tokopedia-backend.vercel.app/list-subcategory'
        );
        setSubCategoryList(res.data);
      } catch (err) {
        console.error('Gagal memuat sub kategori:', err);
      } finally {
        setLoading(false);
      }
    }

    if (value === '3') {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://analisis-produk-tokopedia-backend.vercel.app/list-subcategory'
        );
        setSubCategoryList(res.data);
      } catch (err) {
        console.error('Gagal memuat sub kategori:', err);
      } finally {
        setLoading(false);
      }
    }

    if (value === '4') {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://analisis-produk-tokopedia-backend.vercel.app/produk-multi-lokasi'
        );
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
      if (!selectedSubCategory) return alert('Pilih subkategori terlebih dahulu!');

      setLoading(true);
      try {
        const res = await axios.get(
          `https://analisis-produk-tokopedia-backend.vercel.app/diskon-tertinggi?subcategory=${selectedSubCategory}`
        );
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
        const res = await axios.get(
          'https://analisis-produk-tokopedia-backend.vercel.app/lokasi-terbanyak'
        );
        setData(res.data);
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedAnalysis === '3') {
      if (!selectedSubCategory) return alert('Pilih subkategori terlebih dahulu!');
      setLoading(true);
      try {
        const res = await axios.get(
          `https://analisis-produk-tokopedia-backend.vercel.app/perbandingan-harga?subcategory=${selectedSubCategory}`
        );
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
          `https://analisis-produk-tokopedia-backend.vercel.app/produk-perbandingan?judul=${selectedProduct}`
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

          {(selectedAnalysis === '1' || selectedAnalysis === '3') && (
            <div className="flex flex-col text-sm gap-1">
              <p>Pilih Sub Kategori</p>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between">
                    {selectedSubCategory
                      ? subCategoryList.find((sc) => sc === selectedSubCategory)
                      : 'Pilih Subkategori...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari subkategori..." />
                    <CommandList>
                      <CommandEmpty>Subkategori tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {subCategoryList.map((subcat) => (
                          <CommandItem
                            key={subcat}
                            value={subcat}
                            onSelect={(currentValue) => {
                              setSelectedSubCategory(
                                currentValue === selectedSubCategory ? '' : currentValue
                              );
                              setOpen(false);
                            }}>
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedSubCategory === subcat
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {subcat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {selectedAnalysis === '4' && (
            <div className="flex flex-col text-sm gap-1">
              <p>Pilih Produk</p>
              <Popover open={produkOpen} onOpenChange={setProdukOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={produkOpen}
                    className="w-[400px] justify-between">
                    <p className="truncate">
                      {selectedProduct
                        ? produkList.find((p) => p === selectedProduct)
                        : 'Pilih Produk...'}
                    </p>

                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari produk..." />
                    <CommandList>
                      <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {produkList.map((produk) => (
                          <CommandItem
                            key={produk}
                            value={produk}
                            onSelect={(currentValue) => {
                              setSelectedProduct(currentValue);
                              setProdukOpen(false);
                            }}>
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProduct === produk ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {produk.length > 60 ? produk.slice(0, 60) + '...' : produk}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

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

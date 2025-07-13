import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const data = payload[0].payload;

    return (
      <div
        className="bg-white p-4 rounded-md shadow-md border text-sm max-w-xs"
        style={{ pointerEvents: 'auto', maxHeight: '300px', overflow: 'auto' }}>
        <p className="font-semibold text-base mb-1">{data.delivery}</p>
        <p className="text-gray-700">
          📦 Total Barang: {data.jumlah.toLocaleString('id-ID')}
        </p>
        <p className="text-gray-700 mt-1">📚 {data.jumlah_subkategori} Subkategori</p>
      </div>
    );
  }

  return null;
};

const LokasiTerbanyak = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleBarClick = (data) => {
    setSelectedCity(data); // Simpan data kota yang diklik
  };

  return (
    <div className="flex w-full gap-2">
      {/* LEFT: Chart */}
      <ResponsiveContainer width="70%" height={600}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 80, left: 100, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="delivery" width={180} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="jumlah"
            name="Total Barang"
            fill="#0ea5e9"
            onClick={(e) => handleBarClick(e)}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* RIGHT: Subkategori dari kota yang diklik */}
      <div className="w-[30%] p-4">
        {selectedCity ? (
          <>
            <h2 className="font-semibold text-base mb-2">
              📍 Subkategori di {selectedCity.delivery}
            </h2>
            <p className="text-gray-600 mb-2">
              Total Barang: {selectedCity.jumlah.toLocaleString('id-ID')} <br />
              Jumlah Subkategori: {selectedCity.jumlah_subkategori}
            </p>
            <div className="max-h-[450px] overflow-y-auto pr-1">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {Object.entries(selectedCity.subkategori).map(([name], idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic">
            Klik bar chart untuk melihat detail subkategori.
          </p>
        )}
      </div>
    </div>
  );
};

export default LokasiTerbanyak;

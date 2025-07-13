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
        <p className="text-gray-700 mt-1">📚 {data.jumlah_subkategori} Subkategori:</p>
        <div className="mt-1 max-h-32 overflow-y-auto pr-1">
          <ul className="list-disc list-inside text-gray-600 space-y-0.5">
            {Object.entries(data.subkategori).map(([name, count], idx) => (
              <li key={idx}>
                {name} <span className="text-gray-400">({count})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

const LokasiTerbanyak = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 80, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="delivery" width={180} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="jumlah" name="Total Barang" fill="#0ea5e9" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LokasiTerbanyak;

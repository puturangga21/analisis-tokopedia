import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from 'recharts';

const PerbandinganLokasiProduk = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={data} margin={{ top: 20, right: 50, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="delivery" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => {
            const label = name === 'original price' ? 'Harga Asli' : 'Harga Diskon';
            return [`Rp${value.toLocaleString('id-ID')}`, label];
          }}
        />
        <Legend />
        <Bar dataKey="original price" name="Harga Asli" fill="#eab308" />
        <Bar dataKey="price" name="Harga Diskon" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerbandinganLokasiProduk;

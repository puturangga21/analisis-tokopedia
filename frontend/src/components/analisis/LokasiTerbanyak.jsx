import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
} from 'recharts';

const LokasiTerbanyak = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 50, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="delivery" type="category" width={250} />
        <Tooltip
          formatter={(value) => [`${value.toLocaleString('id-ID')}`, 'Jumlah Stok']}
          labelFormatter={(label) => `Lokasi: ${label}`}
        />
        <Bar dataKey="jumlah" fill="#8b5cf6">
          <LabelList
            dataKey="jumlah"
            position="right"
            formatter={(val) => val.toLocaleString('id-ID')}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LokasiTerbanyak;

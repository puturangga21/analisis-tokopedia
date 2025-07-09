import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  LabelList,
} from 'recharts';

const PerbandinganHarga = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={650}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 80, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="title" type="category" width={400} tickFormatter={(val) => val} />
        <Tooltip
          formatter={(value, name) => {
            const label = name === 'original price' ? 'Harga Asli' : 'Harga Diskon';
            return [`Rp${value.toLocaleString('id-ID')}`, label];
          }}
          labelFormatter={(label, props) => {
            const delivery = props?.[0]?.payload?.delivery ?? '';
            return (
              <div>
                <p>{label}</p>
                <p className="text-gray-600 text-sm">{delivery}</p>
              </div>
            );
          }}
        />
        <Legend />
        <Bar dataKey="original price" name="Harga Asli" fill="#6b7280">
          <LabelList
            dataKey="original price"
            position="right"
            formatter={(val) => `Rp${val.toLocaleString('id-ID')}`}
          />
        </Bar>
        <Bar dataKey="price" name="Harga Setelah Diskon" fill="#ec4899">
          <LabelList
            dataKey="price"
            position="right"
            formatter={(val) => `Rp${val.toLocaleString('id-ID')}`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerbandinganHarga;

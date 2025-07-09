import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { Separator } from '@/components/ui/separator';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const { diskon_rupiah, discount, delivery } = payload[0].payload;

  return (
    <div className="bg-white p-3 rounded-md border border-gray-200 max-w-2xl">
      <p className="text-xl leading-7">{label}</p>
      <p className="text-gray-700 mt-2">{delivery}</p>
      <Separator className="my-2" />
      <p className="text-primary font-bold text-3xl mt-4">
        Rp{diskon_rupiah.toLocaleString('id-ID')} ({discount}%)
      </p>
    </div>
  );
};

const DiskonTerbesar = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={650}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 50, left: 100, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="title" type="category" width={500} tickFormatter={(val) => val} />
        <Tooltip content={<CustomTooltip />} />

        <Bar dataKey="diskon_rupiah" fill="#3b82f6">
          <LabelList
            dataKey="diskon_rupiah"
            position="right"
            formatter={(val, entry) =>
              entry
                ? `Rp${val.toLocaleString('id-ID')} (${entry.discount}%)\n${
                    entry.delivery
                  }`
                : ''
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DiskonTerbesar;

import { FC } from 'react';
import { XAxis, YAxis, Tooltip, ScatterChart, CartesianGrid, Scatter, Legend } from 'recharts';

const Chart: FC<{ data: any }> = ({ data }) => {
    const kh = Array.from(data.filter((row: any) => row['meltpool shape'] == 'keyhole').map((row: any) => ({ v: row['Velocity'], p: row['Power'] })));
    const d = Array.from(data.filter((row: any) => row['meltpool shape'] == 'desirable').map((row: any) => ({ v: row['Velocity'], p: row['Power'] })));
    const lof = Array.from(data.filter((row: any) => row['meltpool shape'] == 'LOF').map((row: any) => ({ v: row['Velocity'], p: row['Power'] })));

    return (
        <ScatterChart
            width={730}
            height={250}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="v" type="number" name="Velocity" />
            <YAxis dataKey="p" type="number" name="Power" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Keyhole" data={kh} fill="#8884d8" />
            <Scatter name="Desirable" data={d} fill="#82ca9d" />
            <Scatter name="LOF" data={lof} fill="#f9849d" />
        </ScatterChart>
    )
}

export default Chart;

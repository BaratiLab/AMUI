import { FC } from 'react';
import { XAxis, YAxis, Tooltip, CartesianGrid, Scatter, Legend, Area, ComposedChart } from 'recharts';

const Chart: FC<{ data: any }> = ({ data }) => {
    console.log(data);
    const kh = Array.from(data.filter((row: any) => row['melt_pool_shape'] == 'keyhole').map((row: any) => ({ v: row['velocity'], p: row['power'] })));
    const d = Array.from(data.filter((row: any) => row['melt_pool_shape'] == 'desirable').map((row: any) => ({ v: row['velocity'], p: row['power'] })));
    const lof = Array.from(data.filter((row: any) => row['melt_pool_shape'] == 'LOF').map((row: any) => ({ v: row['velocity'], p: row['power'] })));

    // TODO: get these values from the backend
    const areaMap = [
        {'v': 0, 'kh': [0, 600], 'd': [0, 0], 'lof': [0, 0]},
        {'v': 850, 'kh': [300, 600], 'd': [150, 300], 'lof': [0, 150]},
        {'v': 1700, 'kh': [300, 600], 'd': [150, 300], 'lof': [0, 150]},
        {'v': 2550, 'kh': [300, 600], 'd': [200, 300], 'lof': [0, 200]},
        {'v': 3400, 'kh': [600, 600], 'd': [200, 600], 'lof': [0, 200]},
    ]

    return (
        <ComposedChart width={730} height={250} data={areaMap}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="v" type="number" name="Velocity" />
            <YAxis dataKey="p" type="number" name="Power" />
            {/* <Tooltip cursor={{ strokeDasharray: '3 3' }} /> */}
            <Legend />
            <Scatter name="Keyhole" data={kh} fill="#8884d8" />
            <Scatter name="Desirable" data={d} fill="#82ca9d" />
            <Scatter name="LOF" data={lof} fill="#f9849d" />

            <Area dataKey="kh" stroke="#8884d8" fill="#8884d8" />
            <Area dataKey="d" stroke="#82ca9d" fill="#82ca9d" />
            <Area dataKey="lof" stroke="#f9849d" fill="#f9849d" />
            {/* <Tooltip /> */}
        </ComposedChart>
    )
}

export default Chart;

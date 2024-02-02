import { FC, useEffect, useState } from 'react';
import Viz from '../components/DataViz';
// @ts-ignore
import meltpoolGeo from "../meltpoolgeometry.csv";

const Temp2: FC = () => {
    return (
        <Viz meltpoolData={meltpoolGeo}/>
    )
};

export default Temp2;

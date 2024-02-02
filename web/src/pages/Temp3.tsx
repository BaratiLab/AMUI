import { FC, useEffect, useState } from 'react';
import Viz from '../components/DataViz';
// @ts-ignore
import meltpoolCls from "../meltpoolclassification.csv";

const Temp3: FC = () => {
    return (
        <Viz meltpoolData={meltpoolCls}/>
    )
};

export default Temp3;

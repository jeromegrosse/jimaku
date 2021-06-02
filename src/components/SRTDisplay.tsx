import {memo, Suspense, useState} from 'react';
import { suspend } from '../utils';
import ReactPlayer from 'react-player';

interface SRTLineData {
    number: string;
    timestamp: string;
    line: string;
}

const getSRTData = (srtPath: string) => fetch(srtPath).then(response => response.text());

const chunkData = (array: Array<string>, size: number):  Array<Array<string>>=> {
    const chunkedArr: Array<Array<string>> = [];

    let index: number = 0;
    while (index < array.length) {
      chunkedArr.push(array.slice(index, size + index));
      index += size;
    }

    return chunkedArr;
};

const SRTLine = ({SRTLineData, onClick}: {SRTLineData:SRTLineData, onClick: (timestampInSeconds: number) => void}) => {
    const {number, timestamp, line} = SRTLineData;

    if(line === undefined) {
        return (<li key={number}></li>);
    }
    
    const [timestampStart] = timestamp.split(' --> ');
    const [hoursStart, minutesStart, secondsAndFrameStart] = timestampStart.split(':');
    const [secondsStart] = secondsAndFrameStart.split(',');
    const timestampInSeconds = parseInt(hoursStart) * 60 * 60 + parseInt(minutesStart) * 60 + parseInt(secondsStart);

    return <div key={number} onClick={() => onClick(timestampInSeconds)}>{timestampStart} - {line} </div>;
}

const SRTInner = ({srtReader, playerRef}: {srtReader: any, playerRef: React.RefObject<ReactPlayer>}) => {
    const data:string = srtReader();
    const parsedData = data.split('\n');
    const chunkedData = chunkData(parsedData, 4);
    const onClick = (timestampInSeconds: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(timestampInSeconds)
        }
    }

    const lines = chunkedData.map((chunk): SRTLineData => {
        const [number, timestamp, line] = chunk;
        return {number, timestamp, line};
    });

    return (<div className="scrollabe-subtitle-list">
        {lines.map((line) => <SRTLine SRTLineData={line} onClick={onClick} />)}
    </div>);
}

const SRTDisplay = ({srtPath, playerRef}: {srtPath: string, playerRef: React.RefObject<ReactPlayer>}) => {
    const [srtReader] = useState(() => suspend(getSRTData, srtPath));

    return(
        <Suspense fallback={<p>Loading</p>}>
            <SRTInner srtReader={srtReader} playerRef={playerRef}/>
        </Suspense>
    );
};

export default memo(SRTDisplay);
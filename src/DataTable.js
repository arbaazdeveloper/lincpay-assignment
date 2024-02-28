import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
const DataTable = ({ dark }) => {
    const [allData, setAllData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [records, setRecords] = useState(0);
    const [pages,setPages]=useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [columState, setColumState] = useState({ api: true, description: true, auth: true, https: true, cors: true, category: true, link: true });

    const getData = async () => {
        const res = await fetch('https://api.publicapis.org/entries');
        const data = await res.json();
        setAllData(data.entries);
        setRecords(data.count / 10);


    }
    const paginate = (pageNumber) => {
        if (pageNumber < 1) {
            return
        }
        const pageSize = 10;
        const lastIndex = pageNumber * pageSize;
        const firstIndex = lastIndex - pageSize;
        const data = allData.slice(firstIndex, lastIndex);
        setShowData(data);
        setPageNumber(pageNumber);

    }
    const convertToCSV = (data) => {
        const header = Object.keys(data[0]).join(',');
        const rows = data.map((row) => Object.values(row).join(','));
        return `${header}\n${rows.join('\n')}`;
    };
    const downloadAsCsv = () => {
        const data = [];
        showData.forEach((item) => {
            const obj = {};
            if (columState.api) {
                obj['API'] = item.API
            }
            if (columState.description) {
                obj['Description'] = item.Description
            }
            if (columState.auth) {
                obj['Auth'] = item.Auth
            }
            if (columState.https) {
                obj['HTTPS'] = item.HTTPS
            }
            if (columState.cors) {
                obj['Cors'] = item.Cors
            }
            if (columState.category) {
                obj['Category'] = item.Category
            }
            if (columState.link) {
                obj['Link'] = item.Link
            }
            data.push(obj)
        });
        const csvData = convertToCSV(data);


        const blob = new Blob([csvData], { type: 'text/csv' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    const changeColumState = (name) => {
        setColumState({ ...columState, [name]: !columState[name] })
    }
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        paginate(1)
    }, [allData]);
    const handlePages=()=>{
        if(pageNumber===1){
            for(let i=1; i<records/10; i++){
                pages.push(i)
            }
        }
    }
  

    return (
        <div className='container'>

            <Table striped bordered hover variant={dark ? 'dark' : 'light'}>
                <thead>
                    <tr>
                        {columState.api && <th onClick={() => changeColumState('api')}>API</th>}
                        {columState.description && <th onClick={() => changeColumState('description')}>Description</th>}
                        {columState.auth && <th onClick={() => changeColumState('auth')}>Auth</th>}
                        {columState.category && <th onClick={() => changeColumState('category')}>Category</th>}
                        {columState.link && <th onClick={() => changeColumState('link')}>Link</th>}
                        {columState.https && <th onClick={() => changeColumState('https')}>HTTPS</th>}
                        {columState.cors && <th onClick={() => changeColumState('cors')}>Cors</th>}

                    </tr>
                </thead>
                <tbody>

                    {showData.map((item, index) => {
                        return <tr>
                            {columState.api && <td>{item.API}</td>}
                            {columState.description && <td>{item.Description}</td>}
                            {columState.auth && <td>{item.Auth}</td>}
                            {columState.category && <td>{item.Category}</td>}
                            {columState.link && <td>{item.Link}</td>}
                            {columState.https && <td>{item.HTTPS.toString()}</td>}
                            {columState.cors && <td>{item.Cors}</td>}

                        </tr>
                    })}
                </tbody>
            </Table>
            <div className='btn-container'><button className='download-btn' onClick={downloadAsCsv}>Download As  CSV</button></div>
            <div className='pages'>
                <button className='btn btn-primary' onClick={() => paginate(pageNumber - 1)}>Prev</button>

               <div className='page-numbers'>{Array.from({ length: records  }).map((item, index) => <span onClick={()=>paginate(index+1)} className={pageNumber===index+1 &&'active'}>{index + 1}</span>)}</div> 

                <button className='btn btn-primary' onClick={() => paginate(pageNumber + 1)}>Next</button>

            </div>
        </div>
    )
}

export default DataTable
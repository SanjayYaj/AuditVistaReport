

import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Col, Row } from 'reactstrap';

const FuzzySearch = ({ keyword, search_files, temp_search_files, dup_search_files, getFuzzySearch }) => {
    const [search, setSearch] = useState('');
    const [currentPageStock, setCurrentPageStock] = useState(1);
    const itemsPerPageStock = 100;

    const fuse = new Fuse(dup_search_files, {
        keys: keyword,
        threshold: 0.2,
        includeScore: true,
        ignoreLocation: true,
    });

    useEffect(() => {
        dataListProcess();
    }, [search, currentPageStock, dup_search_files]);

    const onSearch = (searchTerm) => {
        setSearch(searchTerm.trim().toLowerCase());
    };

    const dataListProcess = () => {
        let filteredFiles = search ? fuse.search(search).map((r) => r.item) : temp_search_files;
        const result = filteredFiles.slice((currentPageStock - 1) * itemsPerPageStock, currentPageStock * itemsPerPageStock);
        getFuzzySearch(result);
    };

   
    return (
        <div>
            <Row>
                <Col>
                    <input
                        type="search"
                        placeholder="Search Group"
                        onChange={(e) => onSearch(e.target.value)}
                        className="form-control w-100 test-class"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default FuzzySearch;
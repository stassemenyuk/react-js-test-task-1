import React, { useEffect, useState } from 'react';

import searchIcon from '../assets/svg/search-icon.svg';
import sortIcon from '../assets/svg/sort-icon.svg';

export default function MainPage() {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSortByDate, setSortByDate] = useState(false);
  const [isSortByState, setSortByState] = useState(false);
  const [isSortByName, setSortByName] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await fetch('https://oril-coins-test.herokuapp.com/list')
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    }
    fetchData();
  }, []);

  function openItemPage(id) {
    window.open(`/item/${id}`, '_self');
  }

  function filterBySearch(arr, search) {
    const newArr = arr.filter((item) => {
      const searchText = search.toLowerCase();
      const name = item.name.toLowerCase();

      return name.includes(searchText);
    });
    return newArr;
  }

  function sortByName(a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
  }

  function sortByDate(a, b) {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
  }

  function sortByState(a, b) {
    if (a.isActive > b.isActive) {
      return -1;
    }
    if (a.isActive < b.isActive) {
      return 1;
    }
  }

  const sortIconImg = (
    <img className="sort-icon" src={sortIcon} alt="sortIcon" width={'6px'} height="4.5px" />
  );

  let filteredItems = filterBySearch(data, searchValue);

  if (isSortByDate) {
    filteredItems = filteredItems.sort(sortByDate);
  }

  if (isSortByState) {
    filteredItems = filteredItems.sort(sortByState);
  }

  if (isSortByName) {
    filteredItems = filteredItems.sort(sortByName);
  }

  const itemsBlock = filteredItems.map((item, index) => {
    const { date, name, isActive, id } = item;
    const a = new Date(date).toLocaleDateString();
    return (
      <tr className="table-item" key={index} onClick={() => openItemPage(id)}>
        <td className="item-name">{name}</td>
        <td className="item-date">{a}</td>
        <td className="item-state" data-active={isActive.toString()}>
          {isActive ? 'Active' : 'Disabled'}
        </td>
      </tr>
    );
  });

  return (
    <div className="main-page">
      <div className="search-block">
        <div className="search-icon">
          <img src={searchIcon} alt="Seacrch icon" width={'16px'} height="16px" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchValue || ''}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <table className="main-list">
        <thead>
          <tr>
            <td
              className="table-title name-col"
              onClick={() => {
                setSortByName(!isSortByName);
                setSortByDate(false);
                setSortByState(false);
              }}>
              Name {isSortByName ? sortIconImg : ''}
            </td>
            <td
              className="table-title date-col"
              onClick={() => {
                setSortByDate(!isSortByDate);
                setSortByName(false);
                setSortByState(false);
              }}>
              Date {isSortByDate ? sortIconImg : ''}
            </td>
            <td
              className="table-title"
              onClick={() => {
                setSortByState(!isSortByState);
                setSortByDate(false);
                setSortByName(false);
              }}>
              State {isSortByState ? sortIconImg : ''}
            </td>
          </tr>
        </thead>
        <tbody>{itemsBlock}</tbody>
      </table>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ItemPage() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [chosenFilter, setChosenFilter] = useState('year');
  const [filteredData, setFilteredData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [mediumAmount, setMediumAmount] = useState(0);

  function countNumbers(arr) {
    if (arr.length >= 1) {
      let min = arr[0].curency,
        max = arr[0].curency,
        total = 0;
      arr.forEach((item) => {
        if (!item.curency || item.curency === 'null') {
          return;
        }
        total += +item.curency;
        if (item.curency < min && item.curency) {
          min = +item.curency;
        }
        if (item.curency > max && item.curency) {
          max = +item.curency;
        }
      });
      setMinAmount(min);
      setMaxAmount(max);
      setTotalAmount(Math.round(total));
      setMediumAmount(Math.round(+(total / arr.length)));
    } else {
      setMinAmount('No data');
      setMaxAmount('No data');
      setTotalAmount('No data');
      setMediumAmount('No data');
    }
  }

  useEffect(() => {
    if (chosenFilter === 'week') {
      const newData = data.filter((item) => {
        if (
          Date.now() >= Date.parse(item.date) &&
          Date.now() - 3600 * 1000 * 24 * 7 <= Date.parse(item.date)
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredData(newData);
      countNumbers(newData);
    } else {
      if (chosenFilter === 'month') {
        const newData = data.filter((item) => {
          if (
            Date.now() >= Date.parse(item.date) &&
            Date.now() - 3600 * 1000 * 24 * 30 <= Date.parse(item.date)
          ) {
            return true;
          } else {
            return false;
          }
        });
        setFilteredData(newData);
        countNumbers(newData);
      } else {
        const newData = data.filter((item) => {
          if (new Date(item.date).getFullYear() === new Date().getFullYear()) {
            return true;
          } else {
            return false;
          }
        });
        setFilteredData(newData);
        countNumbers(newData);
      }
    }
  }, [chosenFilter, data]);

  const dataDates = filteredData.map((item) => {
    return new Date(item.date).toLocaleDateString();
  });

  const dataNums = filteredData.map((item) => {
    return item.curency === 'null' ? '0' : item.curency;
  });

  const dataForChart = {
    labels: dataDates,
    datasets: [
      {
        label: '',
        data: dataNums,
        fill: false,
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {
    async function fetchData() {
      await fetch(`https://oril-coins-test.herokuapp.com/item/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data.data.sort(sortByDate));
        });
    }
    fetchData();
  }, [id]);

  function sortByDate(a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
  }

  // const dataForWeek = data.filter(() => {});

  return (
    <div>
      <div className="chart-box">
        <div className="chart-box__title">
          <div className="chart-box__title__text">Revenue</div>
          <div className="chart-box__title__buttons">
            <button
              onClick={() => setChosenFilter('week')}
              data-chosen={chosenFilter === 'week' ? 'true' : 'false'}>
              Week
            </button>
            <button
              onClick={() => setChosenFilter('month')}
              data-chosen={chosenFilter === 'month' ? 'true' : 'false'}>
              Month
            </button>
            <button
              onClick={() => setChosenFilter('year')}
              data-chosen={chosenFilter === 'year' ? 'true' : 'false'}>
              Year
            </button>
          </div>
        </div>
        <div className="chart-container">
          {dataNums.length >= 1 ? (
            <Line data={dataForChart} options={options} />
          ) : (
            <>
              <div className="no-data-text">There are no data for that period</div>
              <div className="no-data-period">
                {chosenFilter === 'year'
                  ? `${new Date().getFullYear()} year`
                  : chosenFilter === 'month'
                  ? `${new Date(
                      Date.now() - 3600 * 1000 * 24 * 30,
                    ).toLocaleDateString()} - ${new Date(Date.now()).toLocaleDateString()}`
                  : `${new Date(
                      Date.now() - 3600 * 1000 * 24 * 7,
                    ).toLocaleDateString()} - ${new Date(Date.now()).toLocaleDateString()}`}
              </div>
            </>
          )}
        </div>
        <div className="count-container">
          <div className="total-number number-block">
            <div className="number-block__title">Total</div>
            <div className="number-block__number">$ {totalAmount}</div>
          </div>
          <div className="counted-numbers">
            <div className="counted-number number-block">
              <div className="number-block__title">Min</div>
              <div className="number-block__number">$ {minAmount}</div>
            </div>
            <div className="counted-number number-block">
              <div className="number-block__title">Medium</div>
              <div className="number-block__number">$ {mediumAmount}</div>
            </div>
            <div className="counted-number number-block">
              <div className="number-block__title">Max</div>
              <div className="number-block__number">$ {maxAmount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

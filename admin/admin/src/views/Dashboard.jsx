import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const worldwideSalesRef = useRef(null);
  const salesRevenueRef = useRef(null);
  let worldwideChart = useRef(null);
  let salesRevenueChart = useRef(null);

  useEffect(() => {
    // Destroy previous chart instances before creating new ones
    if (worldwideChart.current) worldwideChart.current.destroy();
    if (salesRevenueChart.current) salesRevenueChart.current.destroy();

    // Worldwide Sales Chart
    if (worldwideSalesRef.current) {
      worldwideChart.current = new Chart(worldwideSalesRef.current, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              label: "Sales",
              data: [100, 200, 300, 400, 500],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }

    // Sales & Revenue Chart
    if (salesRevenueRef.current) {
      salesRevenueChart.current = new Chart(salesRevenueRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              label: "Revenue",
              data: [500, 400, 300, 200, 100],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }

    // Cleanup function to destroy charts on component unmount
    return () => {
      if (worldwideChart.current) worldwideChart.current.destroy();
      if (salesRevenueChart.current) salesRevenueChart.current.destroy();
    };
  }, []);

  return (
    <>
      <div className="container pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-12 col-xl-6">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0">Worldwide Sales</h6>
                <a href="#">Show All</a>
              </div>
              <canvas ref={worldwideSalesRef}></canvas>
            </div>
          </div>
          <div className="col-sm-12 col-xl-6">
            <div className="bg-light text-center rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h6 className="mb-0">Sales & Revenue</h6>
                <a href="#">Show All</a>
              </div>
              <canvas ref={salesRevenueRef}></canvas>
            </div>
          </div>
        </div>
      </div>
      <div className="container pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">Recent Salse</h6>
            <a href="">Show All</a>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">Date</th>
                  <th scope="col">Invoice</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>INV-0123</td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>Paid</td>
                  <td>
                    <a className="btn btn-sm btn-primary" href="">
                      Detail
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>INV-0123</td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>Paid</td>
                  <td>
                    <a className="btn btn-sm btn-primary" href="">
                      Detail
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>INV-0123</td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>Paid</td>
                  <td>
                    <a className="btn btn-sm btn-primary" href="">
                      Detail
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>INV-0123</td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>Paid</td>
                  <td>
                    <a className="btn btn-sm btn-primary" href="">
                      Detail
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>INV-0123</td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>Paid</td>
                  <td>
                    <a className="btn btn-sm btn-primary" href="">
                      Detail
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

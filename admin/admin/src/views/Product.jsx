import React from "react";
import productimg from "../../assets/img/1.jpg";
import productimg2 from "../../assets/img/2.jpg";
import productimg3 from "../../assets/img/3.jpg";
import productimg4 from "../../assets/img/4.jpg";
export default function Product() {
  return (
    <>
      <div className="container pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center  mb-4">
            <h6 className="mb-0">Our All Products</h6>
          </div>
          <div className="table-responsive">
            <table className="table text-center align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">Date</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>
                    <img src={productimg} alt="" />
                  </td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>15%</td>
                  <td>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Delete
                    </a>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Update
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>
                    <img src={productimg2} alt="" />
                  </td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>32%</td>
                  <td>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Delete
                    </a>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Update
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>
                    <img src={productimg3} alt="" />
                  </td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>2%</td>
                  <td>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Delete
                    </a>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Update
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>
                    <img src={productimg4} alt="" />
                  </td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>55%</td>
                  <td>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Delete
                    </a>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Update
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>
                    <img src={productimg} alt="" />
                  </td>
                  <td>Jhon Doe</td>
                  <td>$123</td>
                  <td>10%</td>
                  <td>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Delete
                    </a>
                    <a className="btn btn-sm btn-primary mx-2" href="">
                      Update
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

import React from "react";

export default function Category() {
  return (
    <>
      <div className="container pt-4 px-4">
        <div className="bg-light text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0">All Categories</h6>
          </div>
          <div className="table-responsive">
            <table className="table text-center align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">Date</th>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01 Jan 2045</td>
                  <td>INV-0123</td>

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
                  <td>INV-0123</td>

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
                  <td>INV-0123</td>

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
                  <td>INV-0123</td>

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
                  <td>INV-0123</td>

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

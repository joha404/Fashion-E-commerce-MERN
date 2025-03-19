import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/checkout");
        console.log("Fetched Orders:", response.data);
        if (response.data.length > 0) {
          setOrders(response.data.reverse()); // Reverse before setting state
        } else {
          console.warn("No orders found");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Updating status for Order ID: ${orderId} to ${newStatus}`);

    try {
      const response = await axios.put(
        `http://localhost:3000/checkout/${orderId}`,
        {
          status: newStatus,
        }
      );

      console.log("Update Response:", response.data);

      // Update the `orders` state with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const completeOrder = async (id) => {
    try {
      // Move the order to complete
      const response = await fetch(`http://localhost:3000/complete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to complete order");

      // Now delete the order
      const deleteResponse = await fetch(
        `http://localhost:3000/checkout/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!deleteResponse.ok) throw new Error("Failed to delete order");

      // Update state to remove the order
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));

      Swal.fire({
        title: "Order Completed",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Failed to complete order. Please try again.");
    }
  };

  return (
    <div className="container pt-4 px-4">
      <div className="bg-light text-center rounded p-4">
        <div className="d-flex align-items-center mb-4">
          <h6 className="mb-0">Our All Orders</h6>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p>{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table text-center align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-dark">
                  <th scope="col">Date</th>
                  <th scope="col">User Name</th>
                  <th scope="col">User Address</th>
                  <th scope="col">User Phone</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total Price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Transaction ID</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.user.name}</td>
                    <td>{order.user.address}</td>
                    <td>{order.user.phone}</td>
                    <td>
                      {order.cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </td>
                    <td>${order.totalAmount}</td>

                    <td>
                      <div className="form-group">
                        <select
                          className="form-control"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td>{order.tranjectionId}</td>
                    <td>
                      <button onClick={() => completeOrder(order._id)}>
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerManager = () => {
  const [sellers, setSellers] = useState([]); // To hold all seller records
  const [newSeller, setNewSeller] = useState({ firstName: '', lastName: '', address: '', contactNo: '', email: '', username: '', password: '' });
  const [updateSeller, setUpdateSeller] = useState({ id: '', lastName: '', address: '', contactNo: '', email: '', username: '', password: '' });
  const [isUpdating, setIsUpdating] = useState(false); // To toggle between create and update modes

  useEffect(() => {
    fetchSellers(); // Fetch seller data on component load
  }, []);

  // Fetch all sellers
  const fetchSellers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/seller/getSellerRecord');
      console.log('Sellers data:', response.data); // Check the structure of the data
      setSellers(response.data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  // Create a new seller
  const createSeller = async () => {
    try {
      console.log(newSeller); // Check if the form data is being populated correctly
      const response = await axios.post('http://localhost:8080/api/seller/postSellerRecord', newSeller);

      setSellers([...sellers,response.data]);

      //fetchSellers(); // Refresh the list after creation
      setNewSeller({ firstName: '', lastName: '', address: '', contactNo: '', email: '', username: '', password: '' }); // Clear form
    } catch (error) {
      console.error('Error creating seller:', error);
    }
  };

  // Update a seller not yet working
  const updateSellerDetails = async () => {
    try {
      await axios.put(`/api/seller/putSellerRecord`, updateSeller, {
        params: { id: updateSeller.id },
      });
      fetchSellers(); // Refresh the list after updating
      setIsUpdating(false); // Switch back to creating new sellers after update
      setUpdateSeller({ id: '', lastName: '', address: '', contactNo: '', email: '' }); // Clear update form
    } catch (error) {
      console.error('Error updating seller:', error);
    }
  };

  // Delete a seller not yet working
  const deleteSeller = async (id) => {
    try {
      await axios.delete(`/api/seller/deleteSellerRecord/${id}`);
      fetchSellers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  // Start editing a seller
  const editSeller = (seller) => {
    setIsUpdating(true);
    setUpdateSeller({
      id: seller.id,
      lastName: seller.lastName,
      address: seller.address,
      contactNo: seller.contactNo,
      email: seller.email,
    });
  };

  return (
    <div>
      <h1>Seller Management</h1>
      
      {/* Form to create or update seller */}
      <div>
        <h2>{isUpdating ? "Update Seller" : "Create Seller"}</h2>
        <input
          type="text"
          placeholder="Username"
          value={isUpdating ? updateSeller.username : newSeller.username}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, username: e.target.value }) : setNewSeller({ ...newSeller, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={isUpdating ? updateSeller.password : newSeller.password}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, password: e.target.value }) : setNewSeller({ ...newSeller, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="First Name"
          value={isUpdating ? updateSeller.firstName : newSeller.firstName}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, firstName: e.target.value }) : setNewSeller({ ...newSeller, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={isUpdating ? updateSeller.lastName : newSeller.lastName}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, lastName: e.target.value }) : setNewSeller({ ...newSeller, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={isUpdating ? updateSeller.address : newSeller.address}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, address: e.target.value }) : setNewSeller({ ...newSeller, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={isUpdating ? updateSeller.contactNo : newSeller.contactNo}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, contactNo: e.target.value }) : setNewSeller({ ...newSeller, contactNo: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={isUpdating ? updateSeller.email : newSeller.email}
          onChange={(e) => isUpdating ? setUpdateSeller({ ...updateSeller, email: e.target.value }) : setNewSeller({ ...newSeller, email: e.target.value })}
        />
        <button onClick={isUpdating ? updateSellerDetails : createSeller}>
          {isUpdating ? "Update Seller" : "Create Seller"}
        </button>
      </div>

      {/* Table to display all sellers */}
      <div>
        <h2>All Sellers</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {sellers.map((seller) => (
            <tr key={seller.sellerId}>
              <td>{seller.sellerId}</td>
              <td>{seller.firstName}</td>
              <td>{seller.lastName}</td>
              <td>{seller.address}</td>
              <td>{seller.contactNo}</td>
              <td>{seller.email}</td>
              <td>{seller.username}</td>
              <td>{seller.password}</td>
              <td>
                <button onClick={() => editSeller(seller)}>Edit</button>
                <button onClick={() => deleteSeller(seller.sellerId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerManager;

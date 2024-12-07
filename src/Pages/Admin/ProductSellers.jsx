import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductSellers = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-with-sellers');
        setProductData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product data.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Sellers</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Quantity in Stock</th>
            <th>Price</th>
            <th>Category</th>
            <th>Seller Username</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((item, index) => (
            <tr key={index}>
              <td>{item.product.code}</td>
              <td>{item.product.name}</td>
              <td>{item.product.pdtDescription}</td>
              <td>{item.product.qtyInStock}</td>
              <td>{item.product.buyPrice}</td>
              <td>{item.product.category}</td>
              <td>{item.sellerUsername}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSellers;

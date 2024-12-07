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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h1 style={{ color: '#8B4513', fontSize: '32px' }}>Product Management</h1>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search products..."
          style={searchInputStyle}
        />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}><input type="checkbox" /></th>
            <th style={thStyle}>Product Code</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Product Name</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Seller</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((item, index) => (
            <tr key={index} style={trStyle}>
              <td style={tdStyle}><input type="checkbox" /></td>
              <td style={tdStyle}>{item.product.code}</td>
              <td style={tdStyle}>
                <img
                  src={`http://localhost:8080/${item.product.imagePath}`}
                  alt={item.product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
              </td>
              <td style={tdStyle}>{item.product.name}</td>
              <td style={tdStyle}>{item.product.pdtDescription}</td>
              <td style={tdStyle}>{item.product.qtyInStock}</td>
              <td style={tdStyle}>₱{item.product.buyPrice}</td>
              <td style={tdStyle}>{item.product.category}</td>
              <td style={tdStyle}>{item.sellerUsername}</td>
              <td style={tdStyle}>
                <button style={actionButtonStyle}>⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={paginationStyle}>
        <div>Rows per page: <select style={selectStyle}><option>10</option></select></div>
        <div>1-5 of 5</div>
        <button style={paginationButtonStyle}>←</button>
        <button style={paginationButtonStyle}>→</button>
      </div>
    </div>
  );
};

const searchInputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden'
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  backgroundColor: '#f8f8f8',
  fontWeight: '600'
};

const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #ddd'
};

const trStyle = {
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
};


const actionButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '20px'
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '20px',
  padding: '20px 0'
};

const selectStyle = {
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const paginationButtonStyle = {
  padding: '4px 8px',
  border: 'none',
  background: 'none',
  cursor: 'pointer'
};

export default ProductSellers;

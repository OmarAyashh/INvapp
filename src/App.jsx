import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error('Error fetching products:', error);
    else setProducts(data);
  }

  async function addProduct() {
    const { data, error } = await supabase.from('products').insert([
      { name: newProduct, description: description, stored: 0, sold: 0 }
    ]);
    if (error) console.error('Error adding product:', error);
    else {
      setNewProduct('');
      setDescription('');
      fetchProducts();
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Product Inventory App</h1>
      <input
        type="text"
        placeholder="Product name"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>

      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Stored</th>
            <th>Sold</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.stored}</td>
              <td>{product.sold}</td>
              <td>{product.stored - product.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
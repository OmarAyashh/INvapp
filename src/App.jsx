import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [description, setDescription] = useState('');
  const [stored, setStored] = useState(0);
  const [sold, setSold] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error('Fetch error:', error);
    else setProducts(data);
  }

  async function addProduct() {
    const { data, error } = await supabase.from('products').insert([
      {
        name: newProduct,
        description: description,
        stored: stored,
        sold: sold
      }
    ]).select();
    if (error) {
      console.error('Add error:', error);
    } else {
      await supabase.from('history_log').insert([
        {
          product_id: data[0].id,
          change_type: 'add',
          amount: stored,
          note: 'Initial stock added'
        }
      ]);
      setNewProduct('');
      setDescription('');
      setStored(0);
      setSold(0);
      fetchProducts();
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Updated Product Inventory</h2>
      <input placeholder="Product name" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Stored" value={stored} onChange={(e) => setStored(Number(e.target.value))} />
      <input type="number" placeholder="Sold" value={sold} onChange={(e) => setSold(Number(e.target.value))} />
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
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>{prod.description}</td>
              <td>{prod.stored}</td>
              <td>{prod.sold}</td>
              <td>{prod.stored - prod.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
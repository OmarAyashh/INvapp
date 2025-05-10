
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Replace with your actual environment variables or ensure they are injected by Vercel
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function InventoryApp() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stored, setStored] = useState(0);
  const [sold, setSold] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) {
      setProducts(data);
    } else {
      console.error("Failed to fetch products:", error);
    }
  }

  async function addProduct() {
    const { error } = await supabase.from("products").insert([
      {
        name,
        description,
        stored: parseInt(stored),
        sold: parseInt(sold)
      }
    ]);
    if (!error) {
      setName("");
      setDescription("");
      setStored(0);
      setSold(0);
      fetchProducts();
    } else {
      console.error("Error adding product:", error);
    }
  }

  return (
    <div>
      <h2>Product Inventory App</h2>
      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stored"
        value={stored}
        onChange={(e) => setStored(e.target.value)}
      />
      <input
        type="number"
        placeholder="Sold"
        value={sold}
        onChange={(e) => setSold(e.target.value)}
      />
      <button onClick={addProduct}>Add Product</button>

      <table>
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
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.stored}</td>
              <td>{p.sold}</td>
              <td>{p.stored - p.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryApp;

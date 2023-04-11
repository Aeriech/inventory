import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PurchaseComponent = () => {
  const [purchases, setPurchases] = useState([]);
  const [updatedPurchases, setUpdatedPurchases] = useState([]); // Added state for updated purchases

  const { id } = useParams();

  useEffect(() => {
    // Fetch data from the Laravel backend
    fetch(`/api/get-purchase/${id}`) // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => {
        setPurchases(data);
        setUpdatedPurchases([...data]); // Initialize updated purchases with the fetched data
      })
      .catch(error => console.error(error));
  }, []);

  // Function to handle updates to purchase data
  const handlePurchaseUpdate = (index, field, value) => {
    const updatedPurchase = { ...updatedPurchases[index], [field]: value };
    const updatedPurchaseList = [...updatedPurchases];
    updatedPurchaseList[index] = updatedPurchase;
    setUpdatedPurchases(updatedPurchaseList);
  };

  // Function to save updated purchase data
 // Function to save updated purchase data
const savePurchaseUpdates = () => {
    // Send updated purchase data and id to backend for saving
    axios.post(`/api/update-purchases`, { purchases: updatedPurchases }) // Include id in the URL and send data as JSON in request body
      .then(response => response.data) // Use response.data to get data from Axios response
      .then(data => {
        // Handle response from backend
        console.log(data); // Replace with your desired logic
      })
      .catch(error => console.error(error));
  };
  

  return (
    <div>
      <h1>Purchases</h1>
      <ul>
        {purchases.map((purchase, index) => (
          <li key={purchase.id}>
            <p>Product Name: {purchase.name}</p>
            <p>Item Request: {purchase.measurement}</p>
            <p>Measured In: {purchase.measured_in}</p>
            <input
              type="text"
              value={updatedPurchases[index].price || ''}
              onChange={e =>
                handlePurchaseUpdate(index, 'price', e.target.value)
              }
            />
            <input
              type="text"
              value={updatedPurchases[index].itemAdded || ''}
              onChange={e =>
                handlePurchaseUpdate(index, 'itemAdded', e.target.value)
              }
            />
            {/* Add more input fields for other fields you want to update */}
          </li>
        ))}
      </ul>
      <button onClick={savePurchaseUpdates}>Save Updates</button>
    </div>
  );
};

export default PurchaseComponent;

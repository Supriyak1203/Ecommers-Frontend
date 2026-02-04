import Address from "../components/Address";
import Header from "../components/Header";
import Help from "../components/Help";
import OrderDetails from "../components/OrderDetails";
import Orders from "../components/Orders";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import TrackOrder from "../components/TrackOrder";


import { useState } from "react";

export default function ProfilePage({ onLogout }) {

  const [section, setSection] = useState("profile");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  return (
    <>
      <Header onLogout={onLogout} />

      <section className="max-w-6xl mx-auto p-4 grid md:grid-cols-[280px_1fr] gap-6">

        <Sidebar active={section} setSection={setSection} />

        <div className="bg-white rounded-xl shadow-soft p-8">

          {section === "profile" && <Profile />}

          {section === "orders" && (
  <Orders
    openDetails={(id) => {
      console.log("OPEN DETAILS:", id); // 👈 debug
      setSelectedOrderId(id);
      setSection("orderDetails");
    }}
    openTrack={(id) => {
      console.log("OPEN TRACK:", id);
      setSelectedOrderId(id);
      setSection("trackOrder");
    }}
  />
)}


          {section === "orderDetails" && (
            <OrderDetails
              orderId={selectedOrderId}
              back={() => setSection("orders")}
            />
          )}

          {section === "trackOrder" && (
            <TrackOrder
              orderId={selectedOrderId}
              back={() => setSection("orders")}
            />
          )}

          
          {section === "address" && <Address />}
          {section === "help" && <Help />}

        </div>
      </section>
    </>
  );
}

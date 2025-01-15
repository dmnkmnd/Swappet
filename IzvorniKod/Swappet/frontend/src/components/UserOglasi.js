import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "../css/UserOglasi.css";
import axios from "axios";

const defaultProfilePic = "/defaultpfp.jpg";

const UserOglasi = ({ profilePic }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [ads, setAds] = useState([]);
    const [ulaznice, setUlaznice] = useState([]);

    // Fetch user info
    useEffect(() => {
        axios
            .get("http://localhost:8081/user-info", {
                withCredentials: true,
            })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error("Error occurred: ", error);
            });
    }, []);

    useEffect(() => {
        const fetchAds = axios.get("http://localhost:8081/homepage/advertisements");
        const fetchTickets = axios.get("http://localhost:8081/ulaznica/all");

        Promise.all([fetchAds, fetchTickets])
            .then(([adsResponse, ticketsResponse]) => {
                setAds(adsResponse.data);
                setUlaznice(ticketsResponse.data);
                console.log("Fetched tickets:", ticketsResponse.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const filteredAds = ads.filter(ad => ad.numberOfTickets > 0);

    return (
        <div className="admin-page">
            <div className="header">
                <div className="profile">
                    <img
                        src={user?.picture || defaultProfilePic}
                        alt="Profile"
                        className="pfp"
                        onError={(e) => {
                            e.target.src = defaultProfilePic;
                        }}
                    />
                    <div className="username" onClick={() => navigate("/advertisements")}>
                        {user ? user.name : "Loading..."}
                    </div>
                </div>

                <div className="logo" onClick={() => navigate("/")}>
                    S<span id="usklicnik">!</span>
                </div>
            </div>

            <div className="container">
                    <h2 id="oglasi">Svi moji oglasi</h2>
                    
                    <div className="oglasi">
                        {filteredAds.length === 0 ? (
                            <div className="no-events-message">
                                Nema aktivnih oglasa.
                            </div>
                        ) : (
                            filteredAds.map((adWithTickets) => (
                                <Card
                                    key={adWithTickets.id}
                                    ad={adWithTickets}
                                    tickets={adWithTickets.tickets}
                                />
                            ))
                        )}
                    
                </div>
            </div>
        </div>
    );
};

export default UserOglasi;
import React from "react";

function Tableau() {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get('promo');
    
    return (
        <div>
            <h1>Page de test pour {promo}</h1>
        </div>
    );
}

export default Tableau;
import React from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';

function BarreOutils ({}) {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get('promo');

    return (
        <>
        <Link href="/">
          <div className="header-content">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">Lamanager</h1>
          </div>
        </Link>
            <div className="NomPromo">
                <h2>{promo}</h2>
            </div>
            <div className="BarreOutils">
                <ul className="barre-outils-list">
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>7</li>
                    <li>8</li>
                </ul>
            </div>
      </>
    )
}

export default BarreOutils;
import React from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import { Table, ChartColumnIncreasing, MousePointer2, Settings, BookUser, FileUser, Download } from "lucide-react";

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
                    <li><Table /></li>
                    <li><ChartColumnIncreasing /></li>
                    <li><MousePointer2 /></li>
                    <li><Settings /></li>
                    <li><BookUser /></li>
                    <li><FileUser /></li>
                    <li><Download /></li>
                </ul>
            </div>
      </>
    )
}

export default BarreOutils;
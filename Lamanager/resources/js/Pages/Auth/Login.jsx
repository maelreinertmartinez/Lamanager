import React, { useState } from 'react';
import logo from '../../../img/testlogo.png';
import InputLabel from "@/Components/InputLabel.jsx";
import axios from 'axios';
import unilim from "../../../img/logo_universite.png";
import { LogIn } from 'lucide-react';
import { UserRound } from 'lucide-react';
import { Lock } from 'lucide-react';
export default function LoginApp() {
    {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const response = await axios.post('/login', {email, password});
                if (response.status === 200) {
                    window.location.href = '/';
                }
                console.log(response.status)
            } catch (err) {
                console.log(err);
                setError('Invalid credentials');
            }
        };

        return (
            <div className="login-container" onSubmit={handleSubmit}>
                <img src={logo} alt="Logo" className="login-logo"/>

                <h1 className="login-title">Lamanager</h1>
                <h2 className="login-subtitle">Crachez proprement vos prévisionels</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-login">
                        <div className="input-block">
                            <UserRound size={48} className="input-logo"/>

                            <div className="label-input-container">

                                <InputLabel htmlFor="email" value="Identifiant"/>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-rounded"
                                />
                            </div>
                        </div>

                        <div className="input-block">
                            <Lock size={48} className="input-logo"/>

                            <div className="label-input-container">

                                <InputLabel htmlFor="password" value="Mot de passe"/>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-rounded"
                                    required={true}
                                    autoComplete={"current-password"}
                                />
                            </div>
                        </div>
                        {error && <p>{error}</p>}
                    </div>

                    <div className="button-container">
                        <button type="submit" className="login-button" onClick={handleSubmit}>
                            <LogIn/>
                            Se connecter
                        </button>
                    </div>
                </form>
                <img src={unilim} alt="Unilim" className="unilim-logo"/>
            </div>
        );
    }

}

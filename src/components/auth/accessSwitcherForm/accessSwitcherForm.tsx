import { useState, type ChangeEvent, type FormEvent } from 'react'
import AppButton from '../../common/appButton/appButton'
import { loginWithEmailPassword, loginWithGoogle, registerWithEmailPassword } from '../../../services/firebase/auth.services'
import type { AccessSwitcherFormProps } from './accessSwitcherForm.types'
import './accessSwitcherForm.css'

type AuthMode = 'login' | 'register' | 'prompt-register';

export default function AccessSwitcherForm({
  onEnterAdmin,
  onEnterClient,
}: AccessSwitcherFormProps) {
  const [formValues, setFormValues] = useState({ 
    email: '', 
    password: '', 
    displayName: '', 
    phone: '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientDemo = () => {
    setFormValues({ email: 'cliente@fitfuel.com', password: 'password123', displayName: '', phone: '' });
    onEnterClient();
  };

  const handleAdminDemo = () => {
    setFormValues((prev) => ({ ...prev, email: 'admin@fitfuel.com', password: 'password123' }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'login' || mode === 'prompt-register') {
        const user = await loginWithEmailPassword(formValues.email, formValues.password);
        // Validar rol si es necesario. Por ahora asumimos admin si llega aquí (o redirigimos temporalmente a adminDemo)
        onEnterAdmin({ email: user.email || formValues.email });
      } else if (mode === 'register') {
        await registerWithEmailPassword(
          formValues.email, 
          formValues.password, 
          formValues.displayName, 
          formValues.phone
        );
        onEnterClient(); // o lo que corresponda, de momento demo al client:
      }
    } catch (err: unknown) {
      console.error(err);
      // Validar si el error es de credenciales inválidas (usuario no existe o password mal)
      const error = err as { code?: string };
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        if (mode === 'login') {
          // Ofrecer registro
          setMode('prompt-register');
          setError("No se encontró cuenta con esos datos, ¿deseas crear una nueva?");
        } else {
          setError("Credenciales incorrectas. Intenta de nuevo.");
        }
      } else if (error.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      // Si todo sale bien, lo pasamos
      onEnterClient(); 
      // NOTA: aquí se pasa a modo cliente directamente, de acuerdo al flujo.
    } catch (err: unknown) {
      console.error(err);
      setError("Fallo la autenticación con Google.");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const resetToLogin = () => {
    setMode('login');
    setError(null);
    setFormValues((prev) => ({ ...prev, password: '' })); // reset password just in case
  };

  const startRegister = () => {
    setMode('register');
    setError(null);
  };

  return (
    <section className="accessSwitcher" aria-label="Pantalla de inicio de sesión combinada">
      <div className="accessSwitcher__left">
        <header className="accessSwitcher__brand">
          <div className="accessSwitcher__logoBox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2L2 9L11 22L22 9L11 2Z" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 9h20M11 22V2" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="accessSwitcher__brandName">FitFuel</span>
        </header>

        <div className="accessSwitcher__messageWrapper">
          <h1 className="accessSwitcher__heroTitle">
            Nutrición de élite,<br />
            <span className="accessSwitcher__heroHighlight">sabor sin límites.</span>
          </h1>
          <p className="accessSwitcher__heroText">
            Comida fitness premium diseñada por nutriólogos para maximizar tu rendimiento y resultados.
          </p>
          <div className="accessSwitcher__metrics">
            <div className="accessMetric">
              <span className="accessMetric__value">+2,400</span>
              <span className="accessMetric__label">clientes activos</span>
            </div>
            <div className="accessMetric">
              <span className="accessMetric__value">4.9★</span>
              <span className="accessMetric__label">calificación</span>
            </div>
            <div className="accessMetric">
              <span className="accessMetric__value">&lt; 30min</span>
              <span className="accessMetric__label">tiempo entrega</span>
            </div>
          </div>
        </div>
      </div>

      <div className="accessSwitcher__right">
        <div className="accessCard">
          <div className="accessCard__header">
            {mode === 'register' ? (
              <>
                <h2 className="accessCard__title">Crear Cuenta</h2>
                <p className="accessCard__subtitle">Únete para iniciar tus pedidos</p>
              </>
            ) : mode === 'prompt-register' ? (
              <>
                <h2 className="accessCard__title">¿Usuario no encontrado?</h2>
                <p className="accessCard__subtitle">Parece que no tienes cuenta aún.</p>
              </>
            ) : (
              <>
                <h2 className="accessCard__title">Bienvenido de vuelta</h2>
                <p className="accessCard__subtitle">Inicia sesión para continuar</p>
              </>
            )}
          </div>

          {(mode === 'login' || mode === 'prompt-register') && (
            <div className="accessCard__demoAlert">
              <p className="demoAlert__label">ACCESO RÁPIDO (DEMO)</p>
              <div className="demoAlert__buttons">
                <button type="button" className="demoBtn demoBtn--client" onClick={handleClientDemo}>
                  <span>👤</span> Cliente Demo
                </button>
                <button type="button" className="demoBtn demoBtn--admin" onClick={handleAdminDemo}>
                  <span>🛡️</span> Admin Demo
                </button>
              </div>
            </div>
          )}

          <form className="accessCard__form" onSubmit={handleSubmit}>
            {error && <div className="accessCard__error accessCard__error--warning">{error}</div>}
            
            { mode === 'register' && (
              <>
                <div className="formGroup">
                  <label htmlFor="reg-name">Nombre completo</label>
                  <input
                    id="reg-name"
                    name="displayName"
                    type="text"
                    placeholder="Tu nombre y apellido"
                    value={formValues.displayName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label htmlFor="reg-phone">Número de teléfono</label>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    placeholder="Tu número (opcional)"
                    value={formValues.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            <div className="formGroup">
              <label htmlFor="login-email">Correo electrónico</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="login-password">Contraseña</label>
              <div className="passwordInputWrapper">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                />
                <button 
                  type="button" 
                  className="passwordToggleBtn" 
                  onClick={toggleShowPassword}
                  aria-label="Alternar visibilidad de contraseña"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="accessCard__forgotOptions">
                <a href="#olvide-mi-contraseña" onClick={(e)=>e.preventDefault()}>¿Olvidaste tu contraseña?</a>
              </div>
            )}

            {mode === 'prompt-register' ? (
              <div className="accessCard__promptActions">
                <AppButton 
                  label="Sí, registrar este correo" 
                  type="button" 
                  variant="primary" 
                  fullWidth 
                  onClick={startRegister}
                />
                <AppButton 
                  label="No, volver a intentar" 
                  type="button" 
                  variant="secondary" 
                  fullWidth 
                  onClick={resetToLogin}
                />
              </div>
            ) : (
              <AppButton 
                label={loading ? 'Procesando...' : (mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión')} 
                type="submit" 
                variant="primary" 
                fullWidth 
                disabled={loading}
              />
            )}

            <div className="authDivider">
               <span>O</span>
            </div>

            {/* Acceso directo de Google que funciona para crear o acceder */}
            <button 
              type="button" 
              className="googleBtn" 
              onClick={handleGoogleAuth} 
              disabled={loading}
            >
              <svg className="googleIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continuar con Google
            </button>

            {mode !== 'register' ? (
              <div className="accessCard__footer">
                ¿No tienes cuenta? <a href="#registro" onClick={(e) => { e.preventDefault(); startRegister(); }}>Regístrate gratis</a>
              </div>
            ) : (
              <div className="accessCard__footer">
                ¿Ya tienes una cuenta? <a href="#login" onClick={(e) => { e.preventDefault(); resetToLogin(); }}>Inicia sesión</a>
              </div>
            )}
          </form>
        </div>
        
        <div className="accessFloatingHelp">
          <button className="helpBtn">?</button>
        </div>
      </div>
    </section>
  )
}

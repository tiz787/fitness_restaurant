// Importa estado local para controlar los campos del formulario.
import { useState, type ChangeEvent, type FormEvent } from 'react'
// Importa el boton reutilizable para mantener consistencia visual.
import AppButton from '../../common/appButton/appButton'
// Importa tipos de props y del modelo del formulario.
import type { AccessFormValues, AccessSwitcherFormProps } from './accessSwitcherForm.types'
// Importa estilos locales del formulario de acceso.
import './accessSwitcherForm.css'

// Renderiza un acceso simple con formulario y dos botones de rol.
export default function AccessSwitcherForm({
  onEnterAdmin,
  onEnterClient,
}: AccessSwitcherFormProps) {
  // Estado local del formulario (solo para demo visual por ahora).
  const [formValues, setFormValues] = useState<AccessFormValues>({
    email: '',
    password: '',
  })

  // Actualiza el estado cuando el usuario escribe en cualquier input.
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // Extrae nombre de campo y valor actual del input.
    const { name, value } = event.target
    // Convierte el nombre del input al tipo seguro del modelo.
    const fieldName = name as keyof AccessFormValues
    // Guarda el nuevo valor manteniendo el resto de campos intactos.
    setFormValues((previousValues) => ({
      ...previousValues,
      [fieldName]: value,
    }))
  }

  // Procesa el submit del formulario para entrar a la vista admin.
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    // Evita el recargo completo de la pagina.
    event.preventDefault()
    // Notifica al componente padre para cambiar de vista.
    onEnterAdmin(formValues)
  }

  // Renderiza el formulario principal de seleccion de rol.
  return (
    <section className="accessSwitcherForm" aria-label="Acceso rapido por rol">
      <header className="accessSwitcherForm__header">
        <p className="accessSwitcherForm__eyebrow">FitFuel</p>
        <h1 className="accessSwitcherForm__title">Acceso rapido del sistema</h1>
        <p className="accessSwitcherForm__description">
          Esta primera etapa es visual y estatica. Luego conectaremos Firebase Auth y la base de
          datos usando variables en .env.
        </p>
      </header>

      <form className="accessSwitcherForm__form" onSubmit={handleSubmit}>
        <label className="accessSwitcherForm__label" htmlFor="access-email">
          Correo del administrador
        </label>
        <input
          id="access-email"
          name="email"
          type="email"
          placeholder="admin@fitfuel.com"
          value={formValues.email}
          onChange={handleInputChange}
          autoComplete="email"
        />

        <label className="accessSwitcherForm__label" htmlFor="access-password">
          Password temporal
        </label>
        <input
          id="access-password"
          name="password"
          type="password"
          placeholder="********"
          value={formValues.password}
          onChange={handleInputChange}
          autoComplete="current-password"
        />

        <div className="accessSwitcherForm__actions">
          <AppButton label="Entrar como Admin" type="submit" variant="primary" fullWidth />
          <AppButton
            label="Ir a vista Cliente (proximamente)"
            type="button"
            variant="secondary"
            onClick={onEnterClient}
            fullWidth
          />
        </div>
      </form>
    </section>
  )
}

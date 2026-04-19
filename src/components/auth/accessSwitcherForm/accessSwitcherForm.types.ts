// Modelo del formulario de acceso rapido para la etapa visual.
export interface AccessFormValues {
  // Correo digitado para mostrar en el dashboard demo.
  email: string
  // Password temporal del acceso demo (no se valida aun).
  password: string
}

// Propiedades necesarias para comunicar el formulario con App.tsx.
export interface AccessSwitcherFormProps {
  // Callback al presionar entrar como admin.
  onEnterAdmin: (values: AccessFormValues) => void
  // Callback al abrir la vista cliente en estado "proximamente".
  onEnterClient: () => void
}

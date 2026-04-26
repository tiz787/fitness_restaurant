export interface AccessFormValues {
  email: string;
  password: string;
  displayName: string;
  phone: string;
}

export interface AccessSwitcherFormProps {
  onEnterAdmin: (values: { email: string; password?: string }) => void;
  onEnterClient: () => void;
}

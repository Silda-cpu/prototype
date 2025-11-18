import { AuthModal } from '../AuthModal';

export default function AuthModalExample() {
  return (
    <AuthModal
      onLogin={(userData) => console.log('User logged in:', userData)}
      onClose={() => console.log('Modal closed')}
    />
  );
}

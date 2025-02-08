import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Calendar, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { signUp } from '../store/authSlice';
import { AppDispatch } from '../store/store';

type SignUpStep = 'credentials' | 'personal' | 'preferences';

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // État des étapes
  const [currentStep, setCurrentStep] = useState<SignUpStep>('credentials');
  
  // Étape 1 : Identifiants
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Étape 2 : Informations personnelles
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  
  // Étape 3 : Préférences
  const [preferences, setPreferences] = useState({
    genres: [] as string[],
    readingFrequency: '',
    readingTime: '',
    favoriteTopics: [] as string[],
    languagesRead: [] as string[],
    readingGoal: 12
  });
  
  // États généraux
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation du mot de passe
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 6) {
      errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentStep === 'credentials') {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        setError(passwordErrors.join('\n'));
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      setCurrentStep('personal');
    } else if (currentStep === 'personal') {
      if (!name || !birthDate || !gender) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      setCurrentStep('preferences');
    } else {
      if (preferences.genres.length === 0) {
        setError('Veuillez sélectionner au moins un genre');
        return;
      }

      setLoading(true);
      try {
        await dispatch(signUp({
          email,
          password,
          metadata: {
            name,
            birthDate,
            gender,
            preferences
          }
        })).unwrap();
        
        navigate('/');
      } catch (error: any) {
        if (error.message) {
          setError(error.message);
        } else {
          setError('Une erreur est survenue lors de l\'inscription');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCredentialsStep = () => (
    <>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mot de passe
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmer le mot de passe
        </label>
        <div className="mt-1">
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
            placeholder="••••••••"
          />
        </div>
      </div>
    </>
  );

  const renderPersonalStep = () => (
    <>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nom complet
        </label>
        <div className="mt-1">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="birthDate"
          className="block text-sm font-medium text-gray-700"
        >
          Date de naissance
        </label>
        <div className="mt-1">
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Genre
        </label>
        <div className="mt-1">
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="appearance-none block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
          >
            <option value="">Sélectionnez</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
            <option value="prefer_not_to_say">Je préfère ne pas répondre</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderPreferencesStep = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genres préférés
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Roman', 'Science-Fiction', 'Fantasy', 'Policier', 
            'Thriller', 'Romance', 'Historique', 'Biographie'
          ].map((genre) => (
            <label key={genre} className="flex items-center p-3 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                checked={preferences.genres.includes(genre)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({
                      ...preferences,
                      genres: [...preferences.genres, genre]
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      genres: preferences.genres.filter(g => g !== genre)
                    });
                  }
                }}
                className="h-4 w-4 text-malibu-500 focus:ring-malibu-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="readingFrequency"
          className="block text-sm font-medium text-gray-700"
        >
          Fréquence de lecture
        </label>
        <select
          id="readingFrequency"
          value={preferences.readingFrequency}
          onChange={(e) => setPreferences({
            ...preferences,
            readingFrequency: e.target.value
          })}
          className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
        >
          <option value="">Sélectionnez</option>
          <option value="daily">Tous les jours</option>
          <option value="weekly">Plusieurs fois par semaine</option>
          <option value="monthly">Plusieurs fois par mois</option>
          <option value="occasionally">Occasionnellement</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="readingGoal"
          className="block text-sm font-medium text-gray-700"
        >
          Objectif de lecture annuel
        </label>
        <input
          type="number"
          id="readingGoal"
          min="1"
          value={preferences.readingGoal}
          onChange={(e) => setPreferences({
            ...preferences,
            readingGoal: parseInt(e.target.value)
          })}
          className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-malibu-500 focus:border-malibu-500 sm:text-sm"
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-2 bg-gradient-to-br from-malibu-400 to-malibu-500 rounded-xl shadow-sm">
            <Mail className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link
            to="/signin"
            className="font-medium text-malibu-500 hover:text-malibu-600"
          >
            Se connecter
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10">
          {/* Indicateur d'étape */}
          <div className="flex justify-between mb-8">
            {(['credentials', 'personal', 'preferences'] as const).map((step, index) => (
              <div
                key={step}
                className="flex items-center"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === step
                    ? 'bg-malibu-500 text-white'
                    : index < ['credentials', 'personal', 'preferences'].indexOf(currentStep)
                    ? 'bg-feijoa-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < ['credentials', 'personal', 'preferences'].indexOf(currentStep)
                      ? 'bg-feijoa-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-apricot-50 text-apricot-500 rounded-xl text-sm whitespace-pre-line">
                {error}
              </div>
            )}

            {currentStep === 'credentials' && renderCredentialsStep()}
            {currentStep === 'personal' && renderPersonalStep()}
            {currentStep === 'preferences' && renderPreferencesStep()}

            <div className="flex justify-between">
              {currentStep !== 'credentials' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(
                    currentStep === 'preferences' ? 'personal' : 'credentials'
                  )}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900"
                >
                  Retour
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 ml-4 flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-malibu-500 hover:bg-malibu-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-malibu-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Chargement...' : 
                 currentStep === 'preferences' ? 'Créer mon compte' :
                 'Continuer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { SignUp }
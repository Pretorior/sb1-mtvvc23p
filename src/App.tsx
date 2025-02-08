import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Messages } from './pages/Messages';
import { Marketplace } from './pages/Marketplace';
import { Community } from './pages/Community';
import { Library } from './pages/Library';
import { UserProfile } from './pages/UserProfile';
import { Settings } from './pages/Settings';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { BookPage } from './pages/BookPage';
import { WelcomeBanner } from './components/WelcomeBanner';
import { CurrentReading } from './components/CurrentReading';
import { ActivityFeed } from './components/ActivityFeed';
import { SideStats } from './components/SideStats';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { MarketplaceDashboard } from './pages/MarketplaceDashboard';
import { DisputesPage } from './pages/DisputesPage';

function App() {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // Afficher un écran de chargement pendant la vérification de la session
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="p-2 bg-gradient-to-br from-malibu-400 to-malibu-500 rounded-xl shadow-sm">
            <div className="w-12 h-12" />
          </div>
        </div>
      </div>
    );
  }

  // Exemple de données utilisateur
  const currentUser = user ? {
    id: user.id,
    name: user.user_metadata.name || 'Utilisateur',
    email: user.email || '',
    avatar: user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    readingStats: {
      booksRead: 12,
      pagesRead: 3240,
      currentStreak: 5,
      yearlyGoal: 24
    },
    badges: ['lecteur passionné', 'explorateur'],
    following: ['2', '3'],
    followers: ['2', '4', '5'],
    subscription: {
      plan: 'free' as const,
      validUntil: new Date('2024-12-31'),
      autoRenew: false
    },
    preferences: {
      theme: 'light' as const,
      language: 'fr',
      notifications: {
        email: true,
        push: true,
        readingReminders: true,
        groupActivity: true,
        friendActivity: true,
        marketing: false
      },
      privacy: {
        profileVisibility: 'public' as const,
        readingActivity: 'friends' as const,
        libraryVisibility: 'friends' as const,
        showOnlineStatus: true
      }
    }
  } : null;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user ? (
          <div className="flex flex-col">
            <Header user={currentUser!} />
            
            <Routes>
              <Route path="/messages" element={<Messages />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/dashboard" element={<MarketplaceDashboard />} />
              <Route path="/marketplace/disputes" element={<DisputesPage />} />
              <Route path="/marketplace/book/:id" element={<BookDetailsPage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/book/:id" element={<BookDetailsPage />} />
              <Route path="/book/:id" element={<BookPage />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/settings/*" element={<Settings user={currentUser!} onUpdatePrivacy={() => {}} />} />
              <Route path="/" element={
                <main className="flex-1">
                  <WelcomeBanner user={currentUser!} />
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-8">
                        <CurrentReading 
                          book={{
                            id: '1',
                            title: 'Les Misérables',
                            author: 'Victor Hugo',
                            coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
                            pageCount: 1488,
                            progress: {
                              currentPage: 450,
                              startDate: new Date('2024-02-20')
                            }
                          }}
                          onSaveSession={() => {}}
                        />
                        
                        <section>
                          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fil d'actualité</h2>
                          <ActivityFeed />
                        </section>
                      </div>
                      <div className="lg:col-span-4 space-y-6">
                        <SideStats user={currentUser!} />
                      </div>
                    </div>
                  </div>
                </main>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer />
          </div>
        ) : (
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
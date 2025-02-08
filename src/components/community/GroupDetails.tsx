import React, { useState } from 'react';
import { Users, BookOpen, Calendar, MessageSquare, Settings, Plus, Trophy, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReadingEvent } from './ReadingEvent';
import { GroupDiscussion } from './GroupDiscussion';
import { ModeratorMenu } from './ModeratorMenu';
import { ChallengeCard } from './ChallengeCard';
import { ChallengeCreationModal } from './ChallengeCreationModal';
import { EventCreationModal } from './EventCreationModal';
import { MemberManagerModal } from './MemberManagerModal';
import { ReportedContentModal } from './ReportedContentModal';
import { DiscussionModerationModal } from './DiscussionModerationModal';
import { GroupMarketplace } from './GroupMarketplace';

interface GroupDetailsProps {
  group: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    members: {
      id: string;
      name: string;
      avatar: string;
      role: 'admin' | 'moderator' | 'member';
    }[];
    discussions: {
      id: string;
      title: string;
      lastActivity: Date;
      messageCount: number;
    }[];
    pastEvents: {
      id: string;
      title: string;
      date: Date;
      participants: number;
    }[];
  };
  onCreateEvent: (event: any) => void;
  onCreateDiscussion: (discussion: any) => void;
  onJoinEvent: (eventId: string) => void;
  onUpdateProgress: (eventId: string, progress: number) => void;
}

export function GroupDetails({ 
  group,
  onCreateEvent,
  onCreateDiscussion,
  onJoinEvent,
  onUpdateProgress
}: GroupDetailsProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'discussions' | 'members' | 'challenges' | 'marketplace'>('events');
  const [showMemberManager, setShowMemberManager] = useState(false);
  const [showReportedContent, setShowReportedContent] = useState(false);
  const [showDiscussionModeration, setShowDiscussionModeration] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Exemple de données pour les événements
  const events = [
    {
      id: '1',
      title: 'Discussion sur Les Misérables',
      description: 'Venez échanger sur ce chef-d\'œuvre de Victor Hugo',
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-20'),
      book: {
        id: '1',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300'
      },
      schedule: [
        {
          startChapter: 1,
          endChapter: 5,
          deadline: new Date('2024-03-15')
        }
      ],
      participants: [
        {
          id: '1',
          name: 'Alexandre',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          progress: 75
        }
      ],
      discussions: [
        {
          id: '1',
          title: 'Vos premières impressions',
          messageCount: 12,
          lastActivity: new Date('2024-03-10')
        }
      ]
    }
  ];

  // Exemple de données pour les défis
  const challenges = [
    {
      id: '1',
      title: 'Challenge Hugo',
      description: 'Lire 3 œuvres de Victor Hugo',
      type: 'books' as const,
      target: 3,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      participants: [
        {
          id: '1',
          name: 'Alexandre',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          progress: 33
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête du groupe */}
      <div className="bg-gradient-to-br from-malibu-400 to-malibu-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{group.name}</h1>
            <p className="text-malibu-50 text-lg max-w-2xl mx-auto">
              {group.description}
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center text-white/80">
                <Users className="w-5 h-5 mr-2" />
                <span>{group.members.length} membres</span>
              </div>
              <div className="flex items-center text-white/80">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>{group.discussions.length} discussions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 py-4">
            {[
              { key: 'events', label: 'Événements', icon: Calendar },
              { key: 'discussions', label: 'Discussions', icon: MessageSquare },
              { key: 'challenges', label: 'Défis', icon: Trophy },
              { key: 'members', label: 'Membres', icon: Users },
              { key: 'marketplace', label: 'Vente & Échange', icon: ShoppingBag }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-malibu-500 text-white'
                    : 'text-gray-600 hover:text-malibu-500 hover:bg-malibu-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu de modération */}
        <ModeratorMenu
          groupId={group.id}
          onOpenMemberManager={() => setShowMemberManager(true)}
          onOpenReportedContent={() => setShowReportedContent(true)}
        />

        {/* Contenu selon l'onglet actif */}
        <div className="mt-6">
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Événements</h2>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Créer un événement
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {events.map((event) => (
                  <ReadingEvent
                    key={event.id}
                    event={event}
                    onJoin={() => onJoinEvent(event.id)}
                    onUpdateProgress={(progress) => onUpdateProgress(event.id, progress)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discussions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Discussions</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDiscussionModeration(true)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Modération
                  </button>
                  <button
                    onClick={() => onCreateDiscussion({})}
                    className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Nouvelle discussion
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {group.discussions.map((discussion) => (
                  <Link
                    key={discussion.id}
                    to={`/community/discussion/${discussion.id}`}
                    className="block p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900">{discussion.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.messageCount} messages</span>
                      </div>
                      <span>•</span>
                      <span>
                        Dernière activité : {new Date(discussion.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Défis de lecture</h2>
                <button
                  onClick={() => setShowChallengeModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nouveau défi
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={() => console.log('Rejoindre le défi:', challenge.id)}
                    onUpdateProgress={(progress) => console.log('Mise à jour progression:', progress)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Membres</h2>
                <button
                  onClick={() => setShowMemberManager(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-malibu-500 hover:bg-malibu-50 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Gérer les membres
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <Link
                          to={`/profile/${member.id}`}
                          className="font-medium text-gray-900 hover:text-malibu-500"
                        >
                          {member.name}
                        </Link>
                        <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <GroupMarketplace
              groupId={group.id}
              onCreateListing={(listing) => {
                console.log('Nouvelle annonce:', listing);
              }}
            />
          )}
        </div>
      </main>

      {/* Modales */}
      <MemberManagerModal
        isOpen={showMemberManager}
        onClose={() => setShowMemberManager(false)}
        members={group.members.map(m => ({
          ...m,
          joinDate: new Date(),
          status: 'active' as const
        }))}
        onUpdateRole={() => {}}
        onRemoveMember={() => {}}
        onWarnMember={() => {}}
        onSuspendMember={() => {}}
      />

      <ReportedContentModal
        isOpen={showReportedContent}
        onClose={() => setShowReportedContent(false)}
        reports={[]}
        onResolveReport={() => {}}
      />

      <DiscussionModerationModal
        isOpen={showDiscussionModeration}
        onClose={() => setShowDiscussionModeration(false)}
        discussions={[]}
        onLockDiscussion={() => {}}
        onUnlockDiscussion={() => {}}
        onDeleteDiscussion={() => {}}
      />

      <ChallengeCreationModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onCreateChallenge={(challenge) => {
          console.log('Nouveau défi:', challenge);
          setShowChallengeModal(false);
        }}
      />

      <EventCreationModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onCreateEvent={(event) => {
          console.log('Nouvel événement:', event);
          setShowEventModal(false);
        }}
      />
    </div>
  );
}
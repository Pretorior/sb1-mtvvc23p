import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispute, DisputeMessage, DisputeReason, DisputeResolution } from '../types';

interface DisputeState {
  disputes: Dispute[];
  loading: boolean;
  error: string | null;
}

const initialState: DisputeState = {
  disputes: [
    {
      id: 'DSP-001',
      orderId: 'ORD-123',
      buyerId: '2',
      sellerId: '1',
      reason: 'item_not_as_described',
      description: 'Le livre présente des annotations non mentionnées dans l\'annonce.',
      status: 'opened',
      messages: [
        {
          id: 'MSG-001',
          disputeId: 'DSP-001',
          senderId: '2',
          content: 'Le livre comporte de nombreuses annotations au crayon qui n\'étaient pas visibles sur les photos.',
          timestamp: '2024-03-15T10:00:00Z',
          attachments: [
            {
              id: 'ATT-001',
              type: 'image',
              url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
              name: 'annotations-page-1.jpg'
            }
          ]
        }
      ],
      evidence: [
        {
          id: 'EV-001',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
          name: 'preuve-1.jpg',
          uploadedBy: '2',
          timestamp: '2024-03-15T10:00:00Z'
        }
      ],
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z'
    },
    {
      id: 'DSP-002',
      orderId: 'ORD-456',
      buyerId: '1',
      sellerId: '3',
      reason: 'item_not_received',
      description: 'Colis non reçu après 2 semaines.',
      status: 'mediation',
      resolution: 'full_refund',
      amount: 15.99,
      messages: [
        {
          id: 'MSG-002',
          disputeId: 'DSP-002',
          senderId: '1',
          content: 'Je n\'ai toujours pas reçu ma commande après 2 semaines.',
          timestamp: '2024-03-10T14:30:00Z'
        },
        {
          id: 'MSG-003',
          disputeId: 'DSP-002',
          senderId: '3',
          content: 'Le colis a été envoyé le 1er mars avec un numéro de suivi.',
          timestamp: '2024-03-11T09:15:00Z',
          attachments: [
            {
              id: 'ATT-002',
              type: 'document',
              url: '#',
              name: 'preuve-envoi.pdf'
            }
          ]
        },
        {
          id: 'MSG-004',
          disputeId: 'DSP-002',
          senderId: 'support',
          content: 'Suite à notre enquête, nous proposons un remboursement intégral.',
          timestamp: '2024-03-13T11:00:00Z',
          isFromSupport: true
        }
      ],
      evidence: [],
      createdAt: '2024-03-10T14:30:00Z',
      updatedAt: '2024-03-13T11:00:00Z'
    },
    {
      id: 'DSP-003',
      orderId: 'ORD-789',
      buyerId: '4',
      sellerId: '1',
      reason: 'damaged_item',
      description: 'Livre reçu avec la couverture déchirée.',
      status: 'resolved',
      resolution: 'partial_refund',
      amount: 5.00,
      messages: [
        {
          id: 'MSG-005',
          disputeId: 'DSP-003',
          senderId: '4',
          content: 'Le livre est arrivé avec la couverture déchirée.',
          timestamp: '2024-03-05T16:45:00Z',
          attachments: [
            {
              id: 'ATT-003',
              type: 'image',
              url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
              name: 'couverture-abimee.jpg'
            }
          ]
        }
      ],
      evidence: [
        {
          id: 'EV-002',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
          name: 'photo-degat.jpg',
          uploadedBy: '4',
          timestamp: '2024-03-05T16:45:00Z'
        }
      ],
      createdAt: '2024-03-05T16:45:00Z',
      updatedAt: '2024-03-07T10:30:00Z',
      resolvedAt: '2024-03-07T10:30:00Z'
    }
  ],
  loading: false,
  error: null
};

const disputeSlice = createSlice({
  name: 'dispute',
  initialState,
  reducers: {
    addDispute: (state, action: PayloadAction<Omit<Dispute, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newDispute: Dispute = {
        ...action.payload,
        id: `DSP-${state.disputes.length + 1}`.padStart(7, '0'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.disputes.unshift(newDispute);
    },
    updateDispute: (state, action: PayloadAction<{ id: string; updates: Partial<Dispute> }>) => {
      const index = state.disputes.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.disputes[index] = {
          ...state.disputes[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    addMessage: (state, action: PayloadAction<{ disputeId: string; message: Omit<DisputeMessage, 'id'> }>) => {
      const dispute = state.disputes.find(d => d.id === action.payload.disputeId);
      if (dispute) {
        const newMessage: DisputeMessage = {
          ...action.payload.message,
          id: `MSG-${dispute.messages.length + 1}`.padStart(7, '0')
        };
        dispute.messages.push(newMessage);
        dispute.updatedAt = new Date().toISOString();
      }
    },
    addEvidence: (state, action: PayloadAction<{ disputeId: string; evidence: Omit<Dispute['evidence'][0], 'id'> }>) => {
      const dispute = state.disputes.find(d => d.id === action.payload.disputeId);
      if (dispute) {
        const newEvidence = {
          ...action.payload.evidence,
          id: `EV-${dispute.evidence.length + 1}`.padStart(7, '0')
        };
        dispute.evidence.push(newEvidence);
        dispute.updatedAt = new Date().toISOString();
      }
    },
    resolveDispute: (state, action: PayloadAction<{ 
      id: string;
      resolution: DisputeResolution;
      amount?: number;
    }>) => {
      const dispute = state.disputes.find(d => d.id === action.payload.id);
      if (dispute) {
        dispute.status = 'resolved';
        dispute.resolution = action.payload.resolution;
        dispute.amount = action.payload.amount;
        dispute.resolvedAt = new Date().toISOString();
        dispute.updatedAt = new Date().toISOString();
      }
    }
  }
});

export const {
  addDispute,
  updateDispute,
  addMessage,
  addEvidence,
  resolveDispute
} = disputeSlice.actions;

export default disputeSlice.reducer;
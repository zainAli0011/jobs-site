import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubscribeResponse {
  success: boolean;
  message: string;
  subscriber?: {
    id: string;
    email: string;
    phone?: string;
  };
}

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({
        type: 'error',
        message: 'Email is required'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      setStatus({ type: '', message: '' });
      
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, phone })
      });
      
      const data: SubscribeResponse = await response.json();
      
      if (response.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Successfully subscribed to newsletter!'
        });
        setEmail('');
        setPhone('');
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to subscribe. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
      console.error('Error subscribing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Subscribe to Job Alerts</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        Get the latest job opportunities delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {status.message && (
            <div className={`text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {status.message}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </form>
    </div>
  );
} 